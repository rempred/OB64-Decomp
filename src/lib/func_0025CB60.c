typedef unsigned char u8;

extern volatile unsigned int g_func_0025CB60_pointer;
extern volatile u8 g_func_0025CB60_byte_71;

extern void func_0020DF00_noarg(void) asm("func_0020DF00");

void func_0025CB60(unsigned int source, u8 byte70, u8 byte71)
{
    register unsigned int source_reg asm("$4") = source;
    register u8 byte70_reg asm("$5") = byte70;

    if (*(u8 *)source_reg != 0xFF) {
        g_func_0025CB60_pointer = source_reg;
        asm("lui $4,0x8021\n"
            "addiu $4,$4,-0x6F74");
        g_func_0025CB60_byte_71 = byte71;
        asm("lui $1,0x8022");
        asm(".set noreorder");
        func_0020DF00_noarg();
        asm("sb $5,0xF70($1)");
        asm(".set reorder");
    }
}
