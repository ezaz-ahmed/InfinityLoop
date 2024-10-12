import { Injectable } from '@nestjs/common';
import { UpdateMetaOptionDto } from '../dto/update-meta-option.dto';
import { CreateMetaOptionDto } from '../dto/create-meta-option.dto';
import { Repository } from 'typeorm';
import { MetaOption } from '../meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  public async create(createMetaOptionDto: CreateMetaOptionDto) {
    const metaOption = this.metaOptionsRepository.create(createMetaOptionDto);
    return await this.metaOptionsRepository.save(metaOption);
  }

  findAll() {
    return `This action returns all metaOptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} metaOption`;
  }

  public async update(id: number, updateMetaOptionDto: UpdateMetaOptionDto) {
    const metaOption = await this.metaOptionsRepository.findOneBy({ id });

    if (metaOption) {
      Object.assign(metaOption, updateMetaOptionDto);
      return await this.metaOptionsRepository.save(metaOption);
    }

    return null;
  }

  remove(id: number) {
    return `This action removes a #${id} metaOption`;
  }
}
