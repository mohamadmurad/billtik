import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadedImage {
    file: File;
    preview: string;
}

interface ImageUploaderProps {
    onImageChange: (file: File | null) => void;
    initialImageUrl?: string;
}

export default function ImageUploader({ onImageChange, initialImageUrl }: ImageUploaderProps) {
    const [image, setImage] = useState<UploadedImage | null>(initialImageUrl ? { preview: initialImageUrl, file: new File([], '') } : null);
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            const preview = URL.createObjectURL(file);
            setImage({ file, preview });
            onImageChange(file);
        },
        [onImageChange],
    );

    const removeImage = () => {
        if (image?.file) {
            URL.revokeObjectURL(image.preview);
        }
        setImage(null);
        onImageChange(null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false,
    });

    useEffect(() => {
        return () => {
            if (image?.file) {
                URL.revokeObjectURL(image.preview);
            }
        };
    }, [image]);

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className="cursor-pointer rounded-lg border-2 border-dashed border-gray-400 p-6 text-center transition hover:border-blue-500"
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-blue-500">Drop the image here...</p>
                ) : (
                    <p className="text-gray-600">Drag & drop images here, or click to select</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {image && (
                    <div className="group relative h-40 w-40">
                        <img src={image.preview} alt="preview" className="h-full w-full rounded object-cover shadow" />
                        <button
                            onClick={removeImage}
                            className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-xs text-white opacity-0 transition group-hover:opacity-100"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
