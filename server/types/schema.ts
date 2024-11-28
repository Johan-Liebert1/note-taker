export type UserType = {
    id: number;
    email: string;
    password: string;
    username: string;
    created_at: string;
    updated_at: string;
}

export type NoteType = {
    id: number;
    title: string;
    note: string;
    user_id: number; // foreign key
    created_at: string;
    updated_at: string;
}
