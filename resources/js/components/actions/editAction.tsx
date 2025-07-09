import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { PenIcon } from 'lucide-react';

interface ResourceModel {
    id: number | string;
}

interface props {
    resource: string;
    rowModel: ResourceModel;
}

export default function EditAction({ resource, rowModel }: props) {
    return (
        <Link className="m-0" href={route(resource + '.edit', rowModel.id)}>
            <Button variant="ghost">
                <PenIcon size={'20'} />
            </Button>
        </Link>
    );
}
