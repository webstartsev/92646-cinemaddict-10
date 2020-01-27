export const isSubmitPressed = (evt) => {
  return evt.ctrlKey && (evt.key === `Enter` || evt.key === `Ent`);
};
