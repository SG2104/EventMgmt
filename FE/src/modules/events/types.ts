export type EventCategoryType = {
  id: string;
  name: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  categories: EventCategory[];
};

export type Category = {
  id: string;
  name: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type EventCategory = {
  category: Category;
};

export type Event = {
  id: string;
  name: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  categories: EventCategory[];
};
