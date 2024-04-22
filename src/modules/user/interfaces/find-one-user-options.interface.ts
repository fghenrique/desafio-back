export interface FindOneUserOptions {
  key: 'id' | 'email';
  value: string;
  relations?: string[];
  withPasswordHash?: boolean;
}
