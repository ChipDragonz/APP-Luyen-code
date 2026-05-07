// Phân tích mã nguồn và tạo ra các bài tập
export const analyzeCode = async (code) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 1. Tách code thành các khối (hàm, struct...) dựa trên dòng trắng
      let rawBlocks = code.split('\n\n').filter(b => b.trim().length > 0);
      
      if (rawBlocks.length === 1) {
        rawBlocks = code.split('}\n').map(b => b.trim() ? b + '}' : '').filter(b => b.length > 1);
      }
      rawBlocks = rawBlocks.map(b => b.trim()).filter(b => b.length > 0);

      // 2. Tạo levels cho từng khối code
      const levels = [];
      let levelId = 1;

      rawBlocks.forEach((block, index) => {
        // Trích xuất comment để làm mô tả/giải thích hàm
        const commentMatch = block.match(/(?:\/\/\/?\s*(.*)\n)+/);
        let description = 'Không có mô tả chi tiết cho khối lệnh này.';
        let funcName = `Khối code ${index + 1}`;
        
        if (commentMatch) {
          description = commentMatch[0].replace(/\/\/\/?\s*/g, '').trim();
        }

        // Cố gắng tìm tên hàm/struct
        const nameMatch = block.match(/(?:fun|struct)\s+([a-zA-Z0-9_]+)/);
        if (nameMatch) {
          funcName = nameMatch[1];
        } else if (block.includes('const ')) {
          funcName = 'Khai báo hằng số';
        }

        // Tạo bài tập Gõ Code (Typing)
        levels.push({
          id: levelId++,
          type: 'typing',
          title: `Luyện Gõ: ${funcName}`,
          instruction: 'Gõ lại chính xác đoạn mã nguồn này.',
          description: description,
          code: block,
        });

        // Tạo ngẫu nhiên một câu hỏi trắc nghiệm (Quiz) cho một số khối (để kết hợp học và chơi)
        if (nameMatch && Math.random() > 0.3) {
          levels.push({
            id: levelId++,
            type: 'quiz',
            title: `Trắc nghiệm: ${funcName}`,
            instruction: 'Dựa vào đoạn code vừa gõ, hãy chọn đáp án đúng.',
            question: `Chức năng chính hoặc thành phần của '${funcName}' là gì?`,
            options: [
              description.substring(0, 100) + (description.length > 100 ? '...' : ''),
              'Để xóa dữ liệu khỏi bộ nhớ.',
              'Trả về lỗi EHashAlreadyExists trong mọi trường hợp.',
              'Không có tác dụng gì, chỉ để test.'
            ].sort(() => Math.random() - 0.5),
            answer: description.substring(0, 100) + (description.length > 100 ? '...' : ''),
            code: block // Vẫn hiển thị code để tham khảo
          });
        }
      });

      // Bài tập cuối: Sắp xếp lại toàn bộ các block
      if (rawBlocks.length > 1) {
        const shuffledBlocks = rawBlocks.map((content, i) => ({
          id: `b${i}`,
          content: content
        })).sort(() => Math.random() - 0.5);

        levels.push({
          id: levelId++,
          type: 'sort',
          title: 'Nhiệm Vụ Cuối: Lắp Ráp Logic',
          instruction: 'Kéo thả các khối code về đúng thứ tự ban đầu để hệ thống hoạt động.',
          blocks: shuffledBlocks,
          correctOrder: rawBlocks.map((_, i) => `b${i}`)
        });
      }

      if (levels.length === 0) {
        levels.push({
          id: 1,
          type: 'typing',
          title: 'Luyện Gõ: Toàn bộ Code',
          instruction: 'Gõ lại chính xác mã nguồn vào ô bên dưới.',
          description: 'Mã nguồn nguyên bản.',
          code: code.trim(),
        });
      }

      resolve(levels);
    }, 1500); 
  });
};
