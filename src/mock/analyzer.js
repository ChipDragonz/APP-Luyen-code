// Phân tích mã nguồn và tạo ra các bài tập
export const analyzeCode = async (code) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Tách code thành các khối (hàm, struct...) dựa trên dòng trắng (double newline)
      let rawBlocks = code.split('\n\n').filter(b => b.trim().length > 0);
      
      // Nếu không có dòng trắng, chia theo dấu ngoặc nhọn kết thúc '}'
      if (rawBlocks.length === 1) {
        rawBlocks = code.split('}\n').map(b => b.trim() ? b + '}' : '').filter(b => b.length > 1);
      }

      // Xóa khoảng trắng thừa ở đầu/cuối của mỗi block
      rawBlocks = rawBlocks.map(b => b.trim()).filter(b => b.length > 0);

      // Tạo levels cho từng block (Typing Mode)
      const levels = rawBlocks.map((block, index) => ({
        id: index + 1,
        type: 'typing',
        title: `Bài tập ${index + 1}: Gõ mã nguồn`,
        instruction: 'Nhìn đoạn code mẫu ở trên và gõ lại chính xác vào ô bên dưới.',
        code: block,
      }));

      // Bài tập cuối: Sắp xếp lại toàn bộ các block
      if (rawBlocks.length > 1) {
        const shuffledBlocks = rawBlocks.map((content, i) => ({
          id: `b${i}`,
          content: content
        })).sort(() => Math.random() - 0.5);

        levels.push({
          id: levels.length + 1,
          type: 'sort',
          title: 'Bài tập Cuối: Sắp xếp Logic',
          instruction: 'Kéo thả các khối code về đúng thứ tự ban đầu để hoàn thành chương trình.',
          blocks: shuffledBlocks,
          correctOrder: rawBlocks.map((_, i) => `b${i}`)
        });
      }

      // Nếu không chia được block nào, lấy toàn bộ code làm 1 bài
      if (levels.length === 0) {
        levels.push({
          id: 1,
          type: 'typing',
          title: 'Bài tập 1: Gõ mã nguồn',
          instruction: 'Nhìn đoạn code mẫu ở trên và gõ lại chính xác vào ô bên dưới.',
          code: code.trim(),
        });
      }

      resolve(levels);
    }, 1500); // Delay 1.5s
  });
};
