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
    unsigned char field_00_to_67[0x68];
    void *field_68;
    unsigned char field_6C_to_87[0x1C];
    void *field_88;
    unsigned char field_8C_to_9F[0x14];
    CleanupResource *field_A0;
    unsigned int field_A4;
} CleanupObject;

extern void func_000016C4(void *allocation);
extern void func_001C6C04(void *object);

void func_0010738C(CleanupObject *object)
{
    if (object->field_A4 == 0) {
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
}
