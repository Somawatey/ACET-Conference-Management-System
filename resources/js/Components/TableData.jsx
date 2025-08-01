import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'

function Example({ users }) {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Email</TableHeader>
                    <TableHeader>Role</TableHeader>
                </TableRow>
            </TableHead>
            <TableBody>
                {users.map((user) => (
                <TableRow key={user.handle}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-zinc-500">{user.access}</TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}