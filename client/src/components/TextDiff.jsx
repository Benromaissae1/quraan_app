import React from 'react';
import { computeDiff } from '../utils/diff';

export default function TextDiff({ warshText, hafsText }) {
  const diffs = computeDiff(warshText, hafsText);

  return (
    <>
      {diffs.map((diff, idx) => {
        if (diff.type === 'same') {
          const isAyahNumber = /^﴿.*﴾$/.test(diff.text);
          return (
            <span key={idx} className={isAyahNumber ? "ayah-number" : "text-black"}>
              {diff.text}{' '}
            </span>
          );
        }

        const warshStr = diff.warsh.join(' ');
        const hafsStr = diff.hafs.join(' ');

        return (
          <span key={idx} className="diff-container">
            {warshStr && <span className="text-warsh">{warshStr}</span>}
            {hafsStr && <span className="text-hafs">{hafsStr}</span>}
          </span>
        );
      })}
    </>
  );
}
