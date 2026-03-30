export function computeDiff(warshText, hafsText) {
  if (!warshText || !hafsText) return [];

  const warshWords = warshText.split(/\s+/);
  const hafsWords = hafsText.split(/\s+/);
  const matrix = Array(warshWords.length + 1).fill(null)
    .map(() => Array(hafsWords.length + 1).fill(0));

  for (let i = 1; i <= warshWords.length; i++) {
    for (let j = 1; j <= hafsWords.length; j++) {
      if (warshWords[i - 1] === hafsWords[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
      } else {
        matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
      }
    }
  }

  const result = [];
  let i = warshWords.length;
  let j = hafsWords.length;
  const path = [];

  while (i > 0 && j > 0) {
    if (warshWords[i - 1] === hafsWords[j - 1]) {
      path.unshift({ type: 'same', text: warshWords[i - 1] });
      i--;
      j--;
    } else if (matrix[i - 1][j] > matrix[i][j - 1]) {
      path.unshift({ type: 'warsh-only', text: warshWords[i - 1] });
      i--;
    } else {
      path.unshift({ type: 'hafs-only', text: hafsWords[j - 1] });
      j--;
    }
  }

  while (i > 0) {
    path.unshift({ type: 'warsh-only', text: warshWords[i - 1] });
    i--;
  }

  while (j > 0) {
    path.unshift({ type: 'hafs-only', text: hafsWords[j - 1] });
    j--;
  }

  // Next, group consecutive diffs into a single diff block to render them properly side/top
  const groupedResult = [];
  let currentGroup = null;

  for (const step of path) {
    if (step.type === 'same') {
      if (currentGroup) {
        groupedResult.push(currentGroup);
        currentGroup = null;
      }
      groupedResult.push({ type: 'same', text: step.text });
    } else {
      if (!currentGroup) {
        currentGroup = { type: 'diff', warsh: [], hafs: [] };
      }
      if (step.type === 'warsh-only') {
        currentGroup.warsh.push(step.text);
      } else {
        currentGroup.hafs.push(step.text);
      }
    }
  }

  if (currentGroup) {
    groupedResult.push(currentGroup);
  }

  return groupedResult;
}
