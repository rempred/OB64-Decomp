#ifndef OB64_COMMON_CONTROLLER_STATUS_H
#define OB64_COMMON_CONTROLLER_STATUS_H

typedef struct {
    unsigned short type;
    unsigned char status, error;
} ControllerStatus;

void func_00020a0c(unsigned char *bits, ControllerStatus *status);
void __osContGetInitData(unsigned char *bits, ControllerStatus *status);
#endif
