import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';

import { withNotes } from './NoteStore';

const NoteListPure = ({
  savedNotes,
  updateNoteMutation,
  clearNoteMutation,
  noteText,
  setNoteText
}) => (
  <div>
    <h1>Note</h1>
    <div>{savedNotes}</div>
    <div>
      <textarea
        value={noteText}
        onChange={e => setNoteText(e.target.value)}
        placeholder="Whatever else you need to know"
      />
    </div>
    <div>
      <input
        type="submit"
        value="Add"
        onClick={e => {
          updateNoteMutation({ variables: { text: noteText } });
          setNoteText('');
        }}
      />
      <input type="submit" value="Clear" onClick={e => clearNoteMutation()} />
    </div>
  </div>
);

const NoteList = compose(
  withNotes,
  withState('noteText', 'setNoteText', '')
)(NoteListPure);

export default NoteList;
