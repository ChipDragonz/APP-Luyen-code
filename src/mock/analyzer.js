export const analyzeCode = async (code, apiKey = '') => {
  // Nếu có API Key, sử dụng AI thật (Google Gemini)
  if (apiKey && apiKey.trim() !== '') {
    try {
      const prompt = `
Bạn là một chuyên gia lập trình. Hãy phân tích đoạn code sau và chia nó thành các khối hàm (function) hoặc cấu trúc (struct) chính.
Trả về KẾT QUẢ DUY NHẤT LÀ MỘT MẢNG JSON HỢP LỆ (không có markdown \`\`\`json).
Mỗi phần tử trong mảng đại diện cho một khối code, có cấu trúc sau:
{
  "code": "đoạn code gốc của hàm/struct (chỉ lấy code lõi, XÓA HẾT COMMENT để người dùng luyện gõ sạch sẽ)",
  "name": "tên hàm hoặc struct",
  "description": "Giải thích ngắn gọn (1-2 câu tiếng Việt) chức năng của đoạn code này",
  "quiz_question": "Một câu hỏi trắc nghiệm tiếng Việt về chức năng hoặc logic của đoạn code này",
  "quiz_options": ["Đáp án 1", "Đáp án 2", "Đáp án 3", "Đáp án 4"],
  "quiz_answer": "Đáp án đúng (phải giống hệt 1 trong 4 đáp án trên)"
}

Đoạn code cần phân tích:
${code}
`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1, // Giữ độ chính xác cao
          }
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      let textContent = data.candidates[0].content.parts[0].text;
      
      // Xóa markdown json block nếu AI lỡ thêm vào
      textContent = textContent.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const aiBlocks = JSON.parse(textContent);
      
      const levels = [];
      let levelId = 1;

      // Xử lý dữ liệu AI trả về thành dạng bài tập
      aiBlocks.forEach((block, index) => {
        levels.push({
          id: levelId++,
          type: 'typing',
          title: `Luyện Gõ: ${block.name}`,
          instruction: 'Gõ lại chính xác đoạn mã nguồn này.',
          description: block.description,
          code: block.code.trim(),
        });

        // 50% cơ hội xuất hiện câu hỏi trắc nghiệm
        if (Math.random() > 0.5 && block.quiz_options && block.quiz_options.length === 4) {
          levels.push({
            id: levelId++,
            type: 'quiz',
            title: `Trắc nghiệm: ${block.name}`,
            instruction: 'Dựa vào đoạn code vừa gõ, hãy chọn đáp án đúng.',
            question: block.quiz_question,
            options: block.quiz_options.sort(() => Math.random() - 0.5),
            answer: block.quiz_answer,
            code: block.code.trim()
          });
        }
      });

      // Bài tập cuối: Sắp xếp
      if (aiBlocks.length > 1) {
        const shuffledBlocks = aiBlocks.map((b, i) => ({
          id: `b${i}`,
          content: b.code.trim()
        })).sort(() => Math.random() - 0.5);

        levels.push({
          id: levelId++,
          type: 'sort',
          title: 'Nhiệm Vụ Cuối: Lắp Ráp Logic',
          instruction: 'Kéo thả các khối code về đúng thứ tự ban đầu để hệ thống hoạt động.',
          blocks: shuffledBlocks,
          correctOrder: aiBlocks.map((_, i) => `b${i}`)
        });
      }

      return levels;

    } catch (error) {
      console.error("Lỗi khi gọi AI:", error);
      // Fallback xuống Mock nếu lỗi
    }
  }

  // ==========================================
  // FALLBACK MOCK (Khi không có API Key hoặc bị lỗi)
  // ==========================================
  return new Promise((resolve) => {
    setTimeout(() => {
      let rawBlocks = code.split('\n\n').filter(b => b.trim().length > 0);
      
      if (rawBlocks.length === 1) {
        rawBlocks = code.split('}\n').map(b => b.trim() ? b + '}' : '').filter(b => b.length > 1);
      }
      rawBlocks = rawBlocks.map(b => b.trim()).filter(b => b.length > 0);

      const levels = [];
      let levelId = 1;

      rawBlocks.forEach((block, index) => {
        // Trích xuất comment (BỎ QUA CÁC DÒNG CÓ NHIỀU DẤU = HOẶC -)
        const lines = block.split('\n');
        let description = 'Không có mô tả chi tiết cho khối lệnh này.';
        let funcName = `Khối code ${index + 1}`;
        
        for (let line of lines) {
          const trimmed = line.trim();
          // Nếu là comment nhưng không chứa toàn dấu = hoặc -
          if (trimmed.startsWith('//') && !/^(\/\/)\s*[=\-]+$/.test(trimmed)) {
            const cleanText = trimmed.replace(/\/\/\/?\s*/g, '').trim();
            if (cleanText.length > 0) {
              description = cleanText;
              break; // Lấy comment ý nghĩa đầu tiên
            }
          }
        }

        const nameMatch = block.match(/(?:fun|struct)\s+([a-zA-Z0-9_]+)/);
        if (nameMatch) {
          funcName = nameMatch[1];
        } else if (block.includes('const ')) {
          funcName = 'Khai báo hằng số';
        }

        const cleanCode = block.replace(/\/\/.*/g, '').trim();

        if (cleanCode.length === 0) return; // Bỏ qua nếu block chỉ toàn comment

        levels.push({
          id: levelId++,
          type: 'typing',
          title: `Luyện Gõ: ${funcName}`,
          instruction: 'Gõ lại chính xác đoạn mã nguồn này.',
          description: description,
          code: cleanCode,
        });

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
            code: cleanCode
          });
        }
      });

      if (rawBlocks.length > 1) {
        const shuffledBlocks = rawBlocks.map((content, i) => ({
          id: `b${i}`,
          content: content.replace(/\/\/.*/g, '').trim()
        })).filter(b => b.content.length > 0).sort(() => Math.random() - 0.5);

        if (shuffledBlocks.length > 0) {
           levels.push({
             id: levelId++,
             type: 'sort',
             title: 'Nhiệm Vụ Cuối: Lắp Ráp Logic',
             instruction: 'Kéo thả các khối code về đúng thứ tự ban đầu để hệ thống hoạt động.',
             blocks: shuffledBlocks,
             correctOrder: rawBlocks.map((_, i) => `b${i}`)
           });
        }
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
    }, 500); 
  });
};
