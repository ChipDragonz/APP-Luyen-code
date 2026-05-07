// Simulates an API call that analyzes code and generates mini-games
export const analyzeCode = async (code) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // TẠO BÀI TẬP 1: ĐIỀN TỪ (TYPING MODE)
      const keywordsToHide = ['struct', 'fun', 'public', 'entry', 'mut', 'const', 'use', 'return', 'function', 'import', 'export', 'default', 'let'];
      
      let snippet = [];
      // Split by word boundaries to identify keywords without breaking symbols
      const tokens = code.split(/(\b)/); 
      
      let keywordCount = 0;
      tokens.forEach(token => {
        if (keywordsToHide.includes(token) && keywordCount < 10) { // Giấu tối đa 10 từ khóa
          snippet.push({ type: 'input', answer: token, placeholder: 'từ khóa' });
          keywordCount++;
        } else {
          if (snippet.length > 0 && snippet[snippet.length - 1].type === 'text') {
            snippet[snippet.length - 1].content += token;
          } else {
            snippet.push({ type: 'text', content: token });
          }
        }
      });

      // Đảm bảo nếu không có keyword, ta không bị lỗi
      if (keywordCount === 0) {
        const words = code.split(' ');
        if (words.length > 1) {
          snippet = [
            { type: 'text', content: words.slice(0, words.length - 1).join(' ') + ' ' },
            { type: 'input', answer: words[words.length - 1], placeholder: '...' }
          ];
        } else {
           snippet = [{ type: 'text', content: code }];
        }
      }

      // TẠO BÀI TẬP 2: SẮP XẾP (SORT MODE)
      // Chia block theo dòng trắng (double newline)
      let rawBlocks = code.split('\n\n').filter(b => b.trim().length > 0);
      
      // Nếu code không có dòng trắng, chia theo từng dòng
      if (rawBlocks.length < 3) {
        rawBlocks = code.split('\n').filter(b => b.trim().length > 0);
      }

      // Nhóm bớt nếu số lượng quá nhiều (tối đa ~6 khối để dễ chơi)
      if (rawBlocks.length > 6) {
        const mergedBlocks = [];
        const chunkSize = Math.ceil(rawBlocks.length / 5);
        for (let i = 0; i < rawBlocks.length; i += chunkSize) {
          mergedBlocks.push(rawBlocks.slice(i, i + chunkSize).join('\n'));
        }
        rawBlocks = mergedBlocks;
      }

      const correctOrderIds = rawBlocks.map((_, i) => `b${i}`);
      const blocks = rawBlocks.map((content, i) => ({
        id: `b${i}`,
        content: content
      }));

      // Xáo trộn blocks
      const shuffledBlocks = [...blocks].sort(() => Math.random() - 0.5);

      const levels = [
        {
          id: 1,
          type: 'typing',
          title: 'Điền từ khóa',
          instruction: 'Nhập chính xác các từ khóa hoặc cú pháp quan trọng bị thiếu trong đoạn code bên dưới.',
          code: code,
          snippet: snippet
        },
        {
          id: 2,
          type: 'sort',
          title: 'Sắp xếp Logic',
          instruction: 'Kéo thả các khối code về đúng thứ tự ban đầu.',
          blocks: shuffledBlocks,
          correctOrder: correctOrderIds
        }
      ];

      resolve(levels);
    }, 2000); // Delay 2s giả lập
  });
};
