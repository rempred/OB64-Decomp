typedef struct Func001072B8Resource {
    unsigned char field_00_to_1B[0x1C];
    void *field_1C;
    void *field_20;
    void *field_24;
    unsigned char field_28_to_2F[8];
    void *field_30;
    unsigned char field_34_to_3B[8];
    void *field_3C;
} Func001072B8Resource;

typedef struct Func001072B8Object {
    unsigned char field_00_to_67[0x68];
    void *field_68;
    unsigned char field_6C_to_87[0x1C];
    void *field_88;
    unsigned char field_8C_to_9F[0x14];
    Func001072B8Resource *field_A0;
} Func001072B8Object;

extern void *func_000016C4(void *resource);
extern void func_001C6C04(void *object);

void func_001072B8(Func001072B8Object *object)
{
    register Func001072B8Object *saved_object asm("$16");
    register unsigned int zero asm("$0");

    saved_object = (Func001072B8Object *)((unsigned int)object + zero);
    if (saved_object->field_A0 != 0) {
        if (saved_object->field_A0->field_1C != 0) {
            func_000016C4(saved_object->field_A0->field_1C);
            saved_object->field_A0->field_1C = 0;
            func_000016C4(saved_object->field_A0->field_20);
            saved_object->field_A0->field_20 = 0;
            func_000016C4(saved_object->field_A0->field_24);
            saved_object->field_A0->field_24 = 0;
            func_000016C4(saved_object->field_A0->field_30);
            saved_object->field_A0->field_30 = 0;
            if (saved_object->field_A0->field_3C != 0) {
                func_000016C4(saved_object->field_A0->field_3C);
                saved_object->field_A0->field_3C = 0;
            }
        }
        func_000016C4(saved_object->field_A0);
        saved_object->field_A0 = 0;
    }
    if (saved_object->field_68 != 0) {
        func_000016C4(saved_object->field_68);
        saved_object->field_68 = 0;
    }
    func_001C6C04((Func001072B8Object *)((unsigned int)saved_object + zero));
    saved_object->field_88 = 0;
}
