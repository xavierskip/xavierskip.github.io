document.addEventListener('DOMContentLoaded', (event) => {
  // 1. 找到所有 Jekyll 渲染出的代码块容器
  // 通常 Jekyll (kramdown) 会把代码包裹在 div.highlighter-rouge 或 figure.highlight 中
  const codeBlocks = document.querySelectorAll('.highlighter-rouge, figure.highlight');

  codeBlocks.forEach((codeBlock) => {
    // 2. 创建复制按钮
    const button = document.createElement('button');
    button.className = 'copy-code-button';
    button.type = 'button';
    button.innerText = 'Copy';

    // 3. 添加点击事件
    button.addEventListener('click', () => {
      // 获取代码文本
      // 注意：这里我们需要找到实际的 code 标签，去掉可能存在的行号等干扰
      const code = codeBlock.querySelector('code').innerText;

      // 使用 Clipboard API 写入剪贴板
      navigator.clipboard.writeText(code).then(() => {
        // 复制成功后的视觉反馈
        button.innerText = 'Copied!';
        button.classList.add('copied');

        // 2秒后恢复原状
        setTimeout(() => {
          button.innerText = 'Copy';
          button.classList.remove('copied');
        }, 2000);
      }).catch(err => {
        console.error('无法复制: ', err);
        button.innerText = 'Error';
      });
    });

    // 4. 将按钮插入到代码块容器中
    // 确保容器有 position: relative，这样按钮可以使用 absolute 定位
    codeBlock.style.position = 'relative'; 
    codeBlock.appendChild(button);
  });
});