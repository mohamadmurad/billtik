import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { PenIcon } from 'lucide-react';
import * as React from 'react';

interface ResourceModel {
    id: number | string;
}

interface ActionProps {
    resource: string;
    disabled?: boolean;
    rowModel: ResourceModel;
}

export default function EditAction({ resource, rowModel, disabled = false }: ActionProps & React.ComponentProps<'button'>) {
    return (
        <Link className="m-0" href={route(resource + '.edit', rowModel.id)} disabled={disabled} >
            <Button variant="ghost"  disabled={disabled}>
                <PenIcon size={'20'} />
            </Button>
        </Link>
    );
}
