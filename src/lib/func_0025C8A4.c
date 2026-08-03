typedef unsigned char u8;

extern volatile void *g_func_0025C8A4_saved_arg;
extern const u8 g_func_0025C8A4_message[];
extern void func_0020DF00(const u8 *message);

void func_0025C8A4(void *arg)
{
    g_func_0025C8A4_saved_arg = arg;
    func_0020DF00(g_func_0025C8A4_message);
}

asm(".size func_0025C8A4,44");
