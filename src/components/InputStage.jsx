import React, { useState } from 'react';
import { Play, Code2, Github, CheckSquare, Square, FolderGit2 } from 'lucide-react';

export default function InputStage({ onSubmit }) {
  const [code, setCode] = useState('');
  const [githubFiles, setGithubFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isFetchingTree, setIsFetchingTree] = useState(false);
  const [githubRepoUrl, setGithubRepoUrl] = useState('');

  const isRepoUrl = code.trim().match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)$/);

  const handleFetchGithub = async () => {
    if (!isRepoUrl) return alert("Vui lòng nhập đúng link Repo Github (VD: https://github.com/user/repo)");
    
    setIsFetchingTree(true);
    try {
      const owner = isRepoUrl[1];
      const repo = isRepoUrl[2].replace('.git', '');
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      const repoData = await repoRes.json();
      const branch = repoData.default_branch;

      const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
      const treeData = await treeRes.json();
      
      const validExts = ['.js', '.jsx', '.ts', '.tsx', '.move', '.rs', '.py', '.cpp', '.go', '.java', '.sol'];
      const files = treeData.tree.filter(item => 
        item.type === 'blob' && 
        validExts.some(ext => item.path.endsWith(ext)) &&
        !item.path.includes('node_modules') &&
        !item.path.includes('dist') &&
        !item.path.includes('build') &&
        !item.path.includes('.min.js')
      );

      setGithubFiles(files);
      setGithubRepoUrl(`https://github.com/${owner}/${repo}/blob/${branch}/`);
      setSelectedFiles([]);
    } catch (e) {
      alert("Lỗi tải Github: " + e.message);
    }
    setIsFetchingTree(false);
  };

  const toggleFile = (path) => {
    if (selectedFiles.includes(path)) {
      setSelectedFiles(selectedFiles.filter(p => p !== path));
    } else {
      setSelectedFiles([...selectedFiles, path]);
    }
  };

  const handleSubmit = () => {
    if (selectedFiles.length > 0) {
      // Chuyển danh sách file đã chọn thành các link trực tiếp
      const fileUrls = selectedFiles.map(path => `${githubRepoUrl}${path}`).join('\n');
      onSubmit(fileUrls);
    } else if (code.trim()) {
      onSubmit(code);
    }
  };

  return (
    <div className="glass-card fade-in">
      <div className="header">
        <div>
          <h2 className="title">Mini-Game Luyện Code</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Dán code trực tiếp HOẶC dán Link Github Repo để chọn file luyện tập.</p>
        </div>
        <Code2 size={32} color="var(--primary-color)" />
      </div>

      <textarea
        className="input-area"
        placeholder="Dán code của bạn HOẶC dán Link Github Repo vào đây... (ví dụ: https://github.com/user/repo)"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          setGithubFiles([]);
          setSelectedFiles([]);
        }}
        spellCheck="false"
        style={{ minHeight: githubFiles.length > 0 ? '60px' : '250px', transition: 'all 0.3s' }}
      />

      {isRepoUrl && githubFiles.length === 0 && (
        <button 
          className="btn btn-outline" 
          onClick={handleFetchGithub}
          disabled={isFetchingTree}
          style={{ width: '100%', marginBottom: '1.5rem', justifyContent: 'center' }}
        >
          <Github size={18} />
          {isFetchingTree ? 'Đang đọc Repo...' : 'Quét danh sách file từ Github Repo'}
        </button>
      )}

      {githubFiles.length > 0 && (
        <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '0.5rem', border: '1px solid var(--border-color)', marginBottom: '1.5rem', maxHeight: '300px', overflowY: 'auto' }}>
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'sticky', top: 0, backgroundColor: 'var(--card-bg)', zIndex: 1 }}>
            <FolderGit2 size={18} color="var(--primary-color)" />
            <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Chọn các file bạn muốn luyện tập ({selectedFiles.length}/{githubFiles.length})</h4>
          </div>
          <div style={{ padding: '0.5rem' }}>
            {githubFiles.map(file => {
              const isSelected = selectedFiles.includes(file.path);
              return (
                <div 
                  key={file.path}
                  onClick={() => toggleFile(file.path)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    padding: '0.75rem', 
                    cursor: 'pointer',
                    borderRadius: '0.25rem',
                    backgroundColor: isSelected ? 'rgba(0, 255, 65, 0.1)' : 'transparent',
                    color: isSelected ? 'var(--primary-color)' : 'var(--text-color)',
                    transition: 'all 0.1s'
                  }}
                >
                  {isSelected ? <CheckSquare size={18} /> : <Square size={18} color="var(--text-muted)" />}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{file.path}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleSubmit}
          disabled={!code.trim() || (githubFiles.length > 0 && selectedFiles.length === 0)}
        >
          <Play size={18} />
          Bắt Đầu Huấn Luyện
        </button>
      </div>
    </div>
  );
}
