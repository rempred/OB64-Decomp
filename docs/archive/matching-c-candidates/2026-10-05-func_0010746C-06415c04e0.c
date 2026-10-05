typedef struct CleanupResource {
    unsigned char field_00_to_1B[0x1C];
    void *field_1C;
    void *field_20;
    void *field_24;
    unsigned char field_28_to_2F[8];
    void *field_30;
    unsigned char field_34_to_3B[8];
    void *field_3C;
} CleanupResource;

typedef struct CleanupObject {
    unsigned int field_00;
    unsigned char field_04_to_67[0x64];
    void *field_68;
    unsigned int field_6C;
    unsigned char field_70_to_87[0x18];
    void *field_88;
    unsigned char field_8C_to_9F[0x14];
    CleanupResource *field_A0;
} CleanupObject;

extern void func_000016C4(void *allocation);
extern void func_001C6C04(void *object);

void func_0010746C(CleanupObject *object)
{
    object->field_00 &= ~2u;
    object->field_6C = 0;
    *((unsigned char *)object + 0x20) = 0;
    object->field_00 &= ~4u;
    object->field_00 &= ~0x200u;
    if (object->field_A0 != 0) {
        if (object->field_A0->field_1C != 0) {
            func_000016C4(object->field_A0->field_1C);
            object->field_A0->field_1C = 0;
            func_000016C4(object->field_A0->field_20);
            object->field_A0->field_20 = 0;
            func_000016C4(object->field_A0->field_24);
            object->field_A0->field_24 = 0;
            func_000016C4(object->field_A0->field_30);
            object->field_A0->field_30 = 0;
            if (object->field_A0->field_3C != 0) {
                func_000016C4(object->field_A0->field_3C);
                object->field_A0->field_3C = 0;
            }
        }
        func_000016C4(object->field_A0);
        object->field_A0 = 0;
    }
    if (object->field_68 != 0) {
        func_000016C4(object->field_68);
        object->field_68 = 0;
    }
    func_001C6C04(object);
    object->field_88 = 0;
}
