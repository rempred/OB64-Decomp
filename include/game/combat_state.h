#ifndef OB64_COMBAT_STATE_H
#define OB64_COMBAT_STATE_H

/* The update routine can access the pointer at state offset 0x4C. */
typedef struct Func001F1218State {
    int field00;
    short field04, field06, field08, field0A, field0C, field0E, field10;
    unsigned char field12[16];
    signed char field22[16];
    unsigned char field32[4], field36[4], field3A[4], field3E[4], field42[4];
    unsigned char field46, field47, field48, pad49[3];
    void *field4C;
} Func001F1218State;

void func_001F1218(Func001F1218State *state, int arg1, int arg2, int arg3, int arg4);

#endif
