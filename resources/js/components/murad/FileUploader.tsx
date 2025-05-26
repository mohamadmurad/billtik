import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadedImage {
    file: File;
    preview: string;
}

interface FileUploaderProps {
    onChange: (file: File | null) => void;
    initialUrl?: string;
}

export default function FileUploader({ onChange, initialUrl }: FileUploaderProps) {
    const [file, setFile] = useState<UploadedImage | null>(
        initialUrl
            ? {
                  preview: initialUrl,
                  file: new File([], ''),
              }
            : null,
    );
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            const preview = URL.createObjectURL(file);
            setFile({ file, preview });
            onChange(file);
        },
        [onChange],
    );

    const removeFile = () => {
        if (file?.file) {
            URL.revokeObjectURL(file.preview);
        }
        setFile(null);
        onChange(null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { '*': [] },
        multiple: false,
    });

    useEffect(() => {
        return () => {
            if (file?.file) {
                URL.revokeObjectURL(file.preview);
            }
        };
    }, [file]);

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className="cursor-pointer rounded-lg border-2 border-dashed border-gray-400 p-6 text-center transition hover:border-blue-500"
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-blue-500">Drop the file here...</p>
                ) : (
                    <p className="text-gray-600">Drag & drop files here, or click to select</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {file && (
                    <div className="group relative h-40 w-40">
                        {file.file.type.startsWith('image/') ? (
                            <img src={file.preview} alt="preview" className="h-full w-full rounded object-cover shadow" />
                        ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center rounded bg-gray-100 text-gray-600 shadow">
                                <div className="text-5xl">📄</div>
                                <div className="mt-2 px-2 text-center text-sm break-words">{file.file.name || 'File'}</div>
                            </div>
                        )}

                        <button
                            onClick={removeFile}
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
