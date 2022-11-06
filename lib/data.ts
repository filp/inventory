export type User = {
  id: string;
  name: string;
};

// In reality, this method would be calling your database server, or something else:
export const getUser = async (id: string): Promise<User> => ({
  id,
  name: 'User from the Server',
});
