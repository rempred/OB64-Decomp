typedef struct SpTaskView SpTaskView;
extern unsigned int __osSpGetStatus(void);

unsigned int func_00024060(SpTaskView *task)
{
    unsigned int *flags = (unsigned int *)((unsigned char *)task + 4);
    unsigned int status = __osSpGetStatus();
    unsigned int yielded = status >> 8;
    yielded &= 1;
    if (status & 0x80) {
        *flags |= yielded;
        *flags &= ~2;
    }
    return yielded;
}
