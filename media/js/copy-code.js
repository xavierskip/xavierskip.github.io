document.addEventListener('DOMContentLoaded', (event) => {
  // 1. 找到所有 Jekyll 渲染出的代码块容器
  // 通常 Jekyll (kramdown) 会把代码包裹在 div.highlighter-rouge 或 figure.highlight 中
  const codeBlocks = document.querySelectorAll('.highlighter-rouge, figure.highlight');

  // 定义 SVG 图标 (使用 Template Literals)
  // 1. 复制图标 (两个重叠的矩形，线条风格)
  const copyIcon = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  `;

  // 2. 成功图标 (对勾)
  const checkIcon = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `;
  
  codeBlocks.forEach((codeBlock) => {
    // 2. 创建复制按钮
    const button = document.createElement('button');
    button.className = 'copy-code-button select-none';
    button.type = 'button';
    button.innerText = 'Copy code';

    // 3. 添加点击事件
    button.addEventListener('click', () => {
      // 获取代码文本
      // 注意：这里我们需要找到实际的 code 标签，去掉可能存在的行号等干扰
      const code = codeBlock.querySelector('code').innerText;

      // 使用 Clipboard API 写入剪贴板
      navigator.clipboard.writeText(code).then(() => {
        // 切换到成功状态
        button.innerHTML = checkIcon;
        button.classList.add('copied');

        // 2秒后恢复
        setTimeout(() => {
          button.innerHTML = copyIcon;
          button.classList.remove('copied');
        }, 2000);
      }).catch(err => {
        console.error('Copy failed', err);
      });
    });

    // 4. 将按钮插入到代码块容器中
    // 确保容器有 position: relative，这样按钮可以使用 absolute 定位
    codeBlock.style.position = 'relative'; 
    codeBlock.appendChild(button);
  });
});