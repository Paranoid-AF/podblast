window.init({ name: '机核网', id: 'gcores', version: '0.1.1' });
window.registerSource({
  id: 'gadio',
  name: 'Gadio',
  preForm: () => {
    return window;
  }
});
window.registerSource({
  id: 'gadionews',
  name: 'Gadio News'
});
window.registerSource({
  id: 'gadiopro',
  name: 'Gadio Pro'
});
