import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { EyeIcon } from 'lucide-react';

interface ResourceModel {
    id: number | string;
}

interface props {
    resource: string;
    rowModel: ResourceModel;
}

export default function ShowAction({ resource, rowModel }: props) {
    return (
        <Link className="m-0" href={route(resource + '.show', rowModel.id)}>
            <Button variant="ghost">
                <EyeIcon size={'20'} />
            </Button>
        </Link>
    );
}
