export const formatText = (text) => {
  if (!text) return '없음';
  // 'ㅇ'을 깔끔한 불릿(•)으로 변경하고 줄바꿈 적용
  const formatted = text.replace(/(^|\s)ㅇ/g, '$1• ');
  return formatted.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ));
};
