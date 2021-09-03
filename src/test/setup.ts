import "@testing-library/jest-dom";

// class LocalStorageMock implements Storage {
//   private storage: Record<string, string>;
//   constructor() {
//     this.storage = {};
//   }
//   get length() {
//     return Object.keys(this.storage).length;
//   }
//   clear() {
//     this.storage = {};
//   }
//   getItem(key: string) {
//     return this.storage[key] ?? null;
//   }
//   key(index: number) {
//     return Object.keys(this.storage)[index] ?? null;
//   }
//   removeItem(key: string) {
//     delete this.storage[key];
//   }
//   setItem(key: string, value: string) {
//     this.storage[key] = value;
//   }
// }

// global.localStorage = new LocalStorageMock();
