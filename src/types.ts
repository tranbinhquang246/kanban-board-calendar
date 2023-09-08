export type Id = string | number;

export type Column = {
  id: Id;
  title: Id;
};

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
};
