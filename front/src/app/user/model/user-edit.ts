export class UserEdit {
  id?: number;
  password?: string;
  username: string;
  role: string;
  characters: UserEditCharacters[];
}

export class UserEditCharacters {
  id: number;
  name: string;
  campaignId?: number;
  campaignName: string;
}
