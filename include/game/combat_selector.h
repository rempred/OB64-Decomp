#ifndef OB64_COMBAT_SELECTOR_H
#define OB64_COMBAT_SELECTOR_H

typedef struct Func001F0E64Record {
    int field_00;
    unsigned short field_04;
    short field_06;
    unsigned short field_08, field_0A;
    unsigned short field_0C, field_0E, field_10;
    unsigned char field_12[16];
    unsigned char field_22[16];
    unsigned char field_32[20];
    unsigned char field_46, field_47, field_48;
} Func001F0E64Record;

void func_001F0E64(Func001F0E64Record *record, unsigned int selector);

#endif
