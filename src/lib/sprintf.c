typedef void *Func000238B0VaList;

asm(".macro move dst,src\n"
    "addu \\dst,\\src,$0\n"
    ".endm\n");

typedef char *(*Func000238B0Output)(char *destination, const char *source, unsigned int count);

extern char *mempcpy(char *destination, const char *source, unsigned int count);
extern int _Printf(Func000238B0Output output, char *destination, const char *format, Func000238B0VaList args);

int func_000238B0(char *destination, const char *format, ...)
{
    int result;

    result = _Printf(mempcpy, destination, format,
                     (Func000238B0VaList)__builtin_next_arg(format));
    if (result >= 0) {
        destination[result] = '\0';
    }
    return result;
}

asm(".size func_000238B0,88");
