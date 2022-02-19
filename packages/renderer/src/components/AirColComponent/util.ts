export function renderText(text: string) {
  return (
    '<span>' +
    text
      .replace(/““(.*)””/, '<span style="color: red">$1</span>')
      .replace(/‘‘(.*)’’/, '<span style="color: orange">$1</span>') +
    '</span>'
  );
}
