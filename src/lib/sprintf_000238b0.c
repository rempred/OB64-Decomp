extern void *memcpy_00023884(void *, const void *, unsigned int);
extern int _Printf(void *(*)(void *, const signed char *, unsigned int),
                   void *, const signed char *, signed char *);
void *mempcpy(void *, const signed char *, unsigned int);

int sprintf(char *buffer, const char *format, ...)
{
    signed char *arguments = (signed char *)__builtin_next_arg(format);
    int result = _Printf(mempcpy, buffer, (const signed char *)format, arguments);
    if (result >= 0)
        buffer[result] = 0;
    return result;
}

void *mempcpy(void *buffer, const signed char *bytes, unsigned int count)
{
    memcpy_00023884(buffer, bytes, count);
    return (char *)buffer + count;
}