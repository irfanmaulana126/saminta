import { Injectable } from '@nestjs/common';
import { ProductType } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class MasterConstService {
  constructor(private prisma: PrismaService) {}

  productType() {
    return Object.values(ProductType).map((v) => {
      switch (v) {
        case ProductType.MAIN_BARENG:
          return {
            code: ProductType.MAIN_BARENG,
            display: 'Main Bareng',
          };
        case ProductType.KOMEN_ALBUM:
          return {
            code: ProductType.KOMEN_ALBUM,
            display: 'Komen Album',
          };
        case ProductType.JOKI_BINTANG:
          return {
            code: ProductType.JOKI_BINTANG,
            display: 'Joki Bintang',
          };
        case ProductType.SUBATHON:
          return {
            code: ProductType.SUBATHON,
            display: 'SUBATHON',
          };
        default:
          return {
            code: '-',
            display: 'Kosong',
          };
      }
    });
  }
}
