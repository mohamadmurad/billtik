import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { EyeIcon } from 'lucide-react';

interface ResourceModel {
    id: number | string;
}

interface ActionProps {
    resource: string;
    rowModel: ResourceModel;
    disabled?: boolean;
}

export default function ShowAction({ resource, rowModel, disabled = false }: ActionProps) {
    return (
        <Link className="m-0" href={route(resource + '.show', rowModel.id)} disabled={disabled}>
            <Button variant="ghost"  disabled={disabled}>
                <EyeIcon size={'20'} />
            </Button>
        </Link>
    );
}
