
export interface ProductProps {
    id: string;
    code: string;
    name: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    markId: string | null;
    userId: string | null;
    markName: string | null;
}