#ifndef OB64_COMMON_OS_PI_HANDLE_H
#define OB64_COMMON_OS_PI_HANDLE_H

typedef struct PiBufferView {
    unsigned int field_00;
    unsigned int field_04;
    unsigned int field_08;
    unsigned int field_0C;
    unsigned int remaining[5];
} PiBufferView;

typedef struct PiTransferView {
    unsigned int type;
    unsigned short field_04;
    unsigned short bufferIndex;
    int field_08;
    unsigned int field_0C;
    unsigned int field_10;
    unsigned int field_14;
    PiBufferView buffer[2];
} PiTransferView;

typedef struct OSPiHandle_s {
    struct OSPiHandle_s *next;
    unsigned char type;
    unsigned char latency;
    unsigned char pageSize;
    unsigned char releaseDuration;
    unsigned char pulse;
    unsigned char domain;
    unsigned short field_0A;
    unsigned int baseAddress;
    unsigned int speed;
    PiTransferView transfer;
} OSPiHandle;

/* The two current-domain slots point to timing records used only at +4..+8. */
typedef struct PiTimingState {
    unsigned char unknown_00[4];
    unsigned char type;
    unsigned char latency;
    unsigned char pageSize;
    unsigned char releaseDuration;
    unsigned char pulse;
} PiTimingState;

extern PiTimingState __Dom1SpeedParam, __Dom2SpeedParam;
extern PiTimingState *__osCurrentHandle[2];

OSPiHandle *func_0001c130(void);

int func_0001be50(OSPiHandle *, int direction, unsigned int device_address,
                 void *dram_address, unsigned int size);
int __osEPiRawStartDma(OSPiHandle *, int direction, unsigned int device_address,
                      void *dram_address, unsigned int size);
int osEPiRawReadIo(OSPiHandle *, unsigned int address, unsigned int *value);
int __osEPiRawReadIo(OSPiHandle *, unsigned int address, unsigned int *value);
int osEPiRawWriteIo(OSPiHandle *, unsigned int address, unsigned int value);
int __osEPiRawWriteIo(OSPiHandle *, unsigned int address, unsigned int value);

#endif
