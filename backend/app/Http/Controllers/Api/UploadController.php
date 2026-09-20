<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    use ApiResponse;

    public function uploadImage(Request $request)
    {
        return $this->handleUpload($request, 'general');
    }

    public function uploadSpaces(Request $request)
    {
        return $this->handleUpload($request, 'spaces');
    }

    public function uploadMembers(Request $request)
    {
        return $this->handleUpload($request, 'members');
    }

    private function handleUpload(Request $request, string $folder)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $file = $request->file('file');
        $filename = time() . '-' . $file->getClientOriginalName();
        $path = $file->storeAs("public/uploads/$folder", $filename);

        return $this->successResponse('File berhasil diupload', [
            'filename' => $filename,
            'url' => url("storage/uploads/$folder/$filename")
        ], 201);
    }
}
