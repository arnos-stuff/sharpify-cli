# Sharpify - Quickly map your images to several formats + ico

## Simple example

Suppose you have an image `dog.svg`, then to convert it to png, jpg, webp and ico, you have to solutions.

- If the image is square, just go ahead and type

```bash
sharpify -i path/to/dog.svg -o out/path/dir
```

You'll most probably get the sizes you want.

- If the image has unequal aspect ratio

You should specify only one dimension using the `--sizes` flag:

```bash
sharpify -i path/to/dog.svg -o out/path/dir -sizes 96x 128x 256x 512x 1096x 2052x
```
