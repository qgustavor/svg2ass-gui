#####################################
##
##	Project: svg2ass
## 	   File: Makefile
##  Created: 2014-10-23
##   Author: Urban Wallasch
##  Modified to use emcc instead of gcc
##

CC      := emcc
INCS    =
CFLAGS  = $(INCS)
CFLAGSX =
LD      = emcc
LIBS    =
LDFLAGS = --closure 1 -O3 -s FORCE_FILESYSTEM=1
CP		= cp
RM      = rm -f
SH		= sh
VERGEN	= $(SH) version.sh

PRJ     = svg2ass
SRC     = $(wildcard *.c)
OBJ     = $(SRC:%.c=%.o)
BIN     = $(PRJ).js
BIN_WA  = $(PRJ).wasm
DEP     = $(PRJ).dep
VER_IN	= version.in
VER_H	= version.h

.PHONY: all release debug clean gen dep

all: release

release: CFLAGS += -O3 -DNDEBUG
release: TAG = -rls
release: gen dep $(BIN)

debug: CFLAGS += -O0 -DDEBUG -g3
debug: TAG = -dbg
debug: gen dep $(BIN)

gen: 
	-@$(CP) $(VER_IN) $(VER_H) 2> /dev/null
	-$(VERGEN) $(VER_IN) $(VER_H) $(TAG)
	
dep:
	$(CC) -MM $(SRC) > $(DEP)

-include $(DEP)

$(BIN): $(OBJ)
	$(LD) $(OBJ) -o $(BIN) $(LDFLAGS)

%.o: %.c
	$(CC) -c $< -o $@ $(CFLAGS) $(CFLAGSX)

clean:
	-${RM} $(OBJ) $(BIN) $(BIN_WA) $(DEP) 2> /dev/null


##  EOF  
#####################################
