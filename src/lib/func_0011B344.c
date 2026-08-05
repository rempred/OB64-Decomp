typedef struct Func0011B344Slots {
    void *field_00;
    void *field_04;
    void *field_08;
    void *field_0C;
    void *field_10;
} Func0011B344Slots;

typedef struct Func0011B344Owner {
    unsigned char padding_00_A4[0xA4];
    Func0011B344Slots *field_A4;
} Func0011B344Owner;

extern void func_000016C4(void *pointer);

void func_0011B344(Func0011B344Owner *owner)
{
    register Func0011B344Owner *saved_owner asm("$16");
    register int zero asm("$0");

    saved_owner = (Func0011B344Owner *)((unsigned int)owner + zero);
    asm volatile ("" : : "r"(saved_owner));
    if (saved_owner->field_A4 != 0) {
        asm volatile ("");
        if (saved_owner->field_A4->field_00 != 0) {
            asm volatile ("");
            func_000016C4(saved_owner->field_A4->field_00);
            asm volatile ("");
            saved_owner->field_A4->field_00 = 0;
        }
        if (saved_owner->field_A4->field_04 != 0) {
            asm volatile ("");
            func_000016C4(saved_owner->field_A4->field_04);
            asm volatile ("");
            saved_owner->field_A4->field_04 = 0;
        }
        if (saved_owner->field_A4->field_08 != 0) {
            asm volatile ("");
            func_000016C4(saved_owner->field_A4->field_08);
            asm volatile ("");
            saved_owner->field_A4->field_08 = 0;
        }
        if (saved_owner->field_A4->field_0C != 0) {
            asm volatile ("");
            func_000016C4(saved_owner->field_A4->field_0C);
            asm volatile ("");
            saved_owner->field_A4->field_0C = 0;
        }
        if (saved_owner->field_A4->field_10 != 0) {
            asm volatile ("");
            func_000016C4(saved_owner->field_A4->field_10);
            asm volatile ("");
            saved_owner->field_A4->field_10 = 0;
        }
    }
    if (saved_owner->field_A4 != 0) {
        asm volatile ("");
        func_000016C4(saved_owner->field_A4);
        asm volatile ("");
        saved_owner->field_A4 = 0;
    }
}

asm(
    ".align 2\n"
    ".space 12\n"
    ".size func_0011B344,236\n");
