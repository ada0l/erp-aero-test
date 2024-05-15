function fromDB(file) {
  return {
    id: file.id,
    name: file.name,
    extension: file.extension,
    mime: file.mime,
    size: file.size,
  };
}

module.exports = { fromDB };
