export interface TodoSection {
  title: string;
  list: TodoSectionListItem[];
}

export interface TodoSectionListItem {
  todo: string;
  status: boolean;
}
