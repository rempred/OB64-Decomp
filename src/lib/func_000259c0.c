typedef struct ViContextView {
    unsigned short state;
    unsigned short retraceCount;
    void *framebuffer;
    void *mode;
    unsigned int control;
} ViContextView;
extern ViContextView *D_800ABBD4;
extern unsigned int __osDisableInt(void);
extern void __osRestoreInt(unsigned int mask);

void func_000259c0(void *mode)
{
    unsigned int mask = __osDisableInt();
    D_800ABBD4->mode = mode;
    D_800ABBD4->state = 1;
    D_800ABBD4->control = ((unsigned int *)D_800ABBD4->mode)[1];
    __osRestoreInt(mask);
}
