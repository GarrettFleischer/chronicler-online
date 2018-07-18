
export const sceneLayout = (scene) => {
  const labels = scene.labels();
  let y = 0;
  const layout = [];
  labels.forEach((label) => {
    layout.add({ label, x: 0, y });
    y += 150;
  });
};
