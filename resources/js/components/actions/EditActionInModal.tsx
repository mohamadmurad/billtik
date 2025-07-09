import { Button } from '@/components/ui/button';
import { PenIcon } from 'lucide-react';
import { MouseEventHandler } from 'react';

interface props {
    onClick: MouseEventHandler<HTMLButtonElement> | undefined;
}

export default function EditActionInModal({ onClick }: props) {
    return (
        <Button variant="ghost" className="m-0" onClick={onClick}>
            <PenIcon size={'20'} />
        </Button>
    );
}
