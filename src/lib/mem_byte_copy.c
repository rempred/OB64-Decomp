/* ROM 1FCE0 copies forward; negative lengths perform no stores. */
void mem_byte_copy(const void *source, void *destination, int length)
{
    const unsigned char *input = source;
    unsigned char *output = destination;
    int i;

    for (i = 0; i < length; i++)
        *output++ = *input++;
}
