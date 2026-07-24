-- GENERATED FILE. Run `npm run generate:dataset` to rebuild it.
-- Contains only synthetic development/staging data. Never seed production.

begin;

-- Replace only deterministic synthetic reports; user-created data is untouched.
delete from public.audit_logs
where entity_type = 'report'
  and entity_id in (
    '10000000-0000-4000-8000-000000000001'::uuid,
    '10000000-0000-4000-8000-000000000002'::uuid,
    '10000000-0000-4000-8000-000000000003'::uuid,
    '10000000-0000-4000-8000-000000000004'::uuid,
    '10000000-0000-4000-8000-000000000005'::uuid,
    '10000000-0000-4000-8000-000000000006'::uuid,
    '10000000-0000-4000-8000-000000000007'::uuid,
    '10000000-0000-4000-8000-000000000008'::uuid,
    '10000000-0000-4000-8000-000000000009'::uuid,
    '10000000-0000-4000-8000-000000000010'::uuid,
    '10000000-0000-4000-8000-000000000011'::uuid,
    '10000000-0000-4000-8000-000000000012'::uuid,
    '10000000-0000-4000-8000-000000000013'::uuid,
    '10000000-0000-4000-8000-000000000014'::uuid,
    '10000000-0000-4000-8000-000000000015'::uuid,
    '10000000-0000-4000-8000-000000000016'::uuid,
    '10000000-0000-4000-8000-000000000017'::uuid,
    '10000000-0000-4000-8000-000000000018'::uuid,
    '10000000-0000-4000-8000-000000000019'::uuid,
    '10000000-0000-4000-8000-000000000020'::uuid,
    '10000000-0000-4000-8000-000000000021'::uuid,
    '10000000-0000-4000-8000-000000000022'::uuid,
    '10000000-0000-4000-8000-000000000023'::uuid,
    '10000000-0000-4000-8000-000000000024'::uuid,
    '10000000-0000-4000-8000-000000000025'::uuid,
    '10000000-0000-4000-8000-000000000026'::uuid,
    '10000000-0000-4000-8000-000000000027'::uuid,
    '10000000-0000-4000-8000-000000000028'::uuid,
    '10000000-0000-4000-8000-000000000029'::uuid,
    '10000000-0000-4000-8000-000000000030'::uuid,
    '10000000-0000-4000-8000-000000000031'::uuid,
    '10000000-0000-4000-8000-000000000032'::uuid,
    '10000000-0000-4000-8000-000000000033'::uuid,
    '10000000-0000-4000-8000-000000000034'::uuid,
    '10000000-0000-4000-8000-000000000035'::uuid,
    '10000000-0000-4000-8000-000000000036'::uuid,
    '10000000-0000-4000-8000-000000000037'::uuid,
    '10000000-0000-4000-8000-000000000038'::uuid,
    '10000000-0000-4000-8000-000000000039'::uuid,
    '10000000-0000-4000-8000-000000000040'::uuid,
    '10000000-0000-4000-8000-000000000041'::uuid,
    '10000000-0000-4000-8000-000000000042'::uuid,
    '10000000-0000-4000-8000-000000000043'::uuid,
    '10000000-0000-4000-8000-000000000044'::uuid,
    '10000000-0000-4000-8000-000000000045'::uuid,
    '10000000-0000-4000-8000-000000000046'::uuid,
    '10000000-0000-4000-8000-000000000047'::uuid,
    '10000000-0000-4000-8000-000000000048'::uuid,
    '10000000-0000-4000-8000-000000000049'::uuid,
    '10000000-0000-4000-8000-000000000050'::uuid,
    '10000000-0000-4000-8000-000000000051'::uuid,
    '10000000-0000-4000-8000-000000000052'::uuid,
    '10000000-0000-4000-8000-000000000053'::uuid,
    '10000000-0000-4000-8000-000000000054'::uuid,
    '10000000-0000-4000-8000-000000000055'::uuid,
    '10000000-0000-4000-8000-000000000056'::uuid,
    '10000000-0000-4000-8000-000000000057'::uuid,
    '10000000-0000-4000-8000-000000000058'::uuid,
    '10000000-0000-4000-8000-000000000059'::uuid,
    '10000000-0000-4000-8000-000000000060'::uuid,
    '10000000-0000-4000-8000-000000000061'::uuid,
    '10000000-0000-4000-8000-000000000062'::uuid,
    '10000000-0000-4000-8000-000000000063'::uuid,
    '10000000-0000-4000-8000-000000000064'::uuid,
    '10000000-0000-4000-8000-000000000065'::uuid,
    '10000000-0000-4000-8000-000000000066'::uuid,
    '10000000-0000-4000-8000-000000000067'::uuid,
    '10000000-0000-4000-8000-000000000068'::uuid,
    '10000000-0000-4000-8000-000000000069'::uuid,
    '10000000-0000-4000-8000-000000000070'::uuid,
    '10000000-0000-4000-8000-000000000071'::uuid,
    '10000000-0000-4000-8000-000000000072'::uuid,
    '10000000-0000-4000-8000-000000000073'::uuid,
    '10000000-0000-4000-8000-000000000074'::uuid,
    '10000000-0000-4000-8000-000000000075'::uuid,
    '10000000-0000-4000-8000-000000000076'::uuid,
    '10000000-0000-4000-8000-000000000077'::uuid,
    '10000000-0000-4000-8000-000000000078'::uuid,
    '10000000-0000-4000-8000-000000000079'::uuid,
    '10000000-0000-4000-8000-000000000080'::uuid,
    '10000000-0000-4000-8000-000000000081'::uuid,
    '10000000-0000-4000-8000-000000000082'::uuid,
    '10000000-0000-4000-8000-000000000083'::uuid,
    '10000000-0000-4000-8000-000000000084'::uuid,
    '10000000-0000-4000-8000-000000000085'::uuid,
    '10000000-0000-4000-8000-000000000086'::uuid,
    '10000000-0000-4000-8000-000000000087'::uuid,
    '10000000-0000-4000-8000-000000000088'::uuid,
    '10000000-0000-4000-8000-000000000089'::uuid,
    '10000000-0000-4000-8000-000000000090'::uuid,
    '10000000-0000-4000-8000-000000000091'::uuid,
    '10000000-0000-4000-8000-000000000092'::uuid,
    '10000000-0000-4000-8000-000000000093'::uuid,
    '10000000-0000-4000-8000-000000000094'::uuid,
    '10000000-0000-4000-8000-000000000095'::uuid,
    '10000000-0000-4000-8000-000000000096'::uuid,
    '10000000-0000-4000-8000-000000000097'::uuid,
    '10000000-0000-4000-8000-000000000098'::uuid,
    '10000000-0000-4000-8000-000000000099'::uuid,
    '10000000-0000-4000-8000-000000000100'::uuid,
    '10000000-0000-4000-8000-000000000101'::uuid,
    '10000000-0000-4000-8000-000000000102'::uuid,
    '10000000-0000-4000-8000-000000000103'::uuid,
    '10000000-0000-4000-8000-000000000104'::uuid,
    '10000000-0000-4000-8000-000000000105'::uuid,
    '10000000-0000-4000-8000-000000000106'::uuid,
    '10000000-0000-4000-8000-000000000107'::uuid,
    '10000000-0000-4000-8000-000000000108'::uuid,
    '10000000-0000-4000-8000-000000000109'::uuid,
    '10000000-0000-4000-8000-000000000110'::uuid,
    '10000000-0000-4000-8000-000000000111'::uuid,
    '10000000-0000-4000-8000-000000000112'::uuid,
    '10000000-0000-4000-8000-000000000113'::uuid,
    '10000000-0000-4000-8000-000000000114'::uuid,
    '10000000-0000-4000-8000-000000000115'::uuid,
    '10000000-0000-4000-8000-000000000116'::uuid,
    '10000000-0000-4000-8000-000000000117'::uuid,
    '10000000-0000-4000-8000-000000000118'::uuid,
    '10000000-0000-4000-8000-000000000119'::uuid,
    '10000000-0000-4000-8000-000000000120'::uuid
  );

delete from public.reports
where id in (
    '10000000-0000-4000-8000-000000000001'::uuid,
    '10000000-0000-4000-8000-000000000002'::uuid,
    '10000000-0000-4000-8000-000000000003'::uuid,
    '10000000-0000-4000-8000-000000000004'::uuid,
    '10000000-0000-4000-8000-000000000005'::uuid,
    '10000000-0000-4000-8000-000000000006'::uuid,
    '10000000-0000-4000-8000-000000000007'::uuid,
    '10000000-0000-4000-8000-000000000008'::uuid,
    '10000000-0000-4000-8000-000000000009'::uuid,
    '10000000-0000-4000-8000-000000000010'::uuid,
    '10000000-0000-4000-8000-000000000011'::uuid,
    '10000000-0000-4000-8000-000000000012'::uuid,
    '10000000-0000-4000-8000-000000000013'::uuid,
    '10000000-0000-4000-8000-000000000014'::uuid,
    '10000000-0000-4000-8000-000000000015'::uuid,
    '10000000-0000-4000-8000-000000000016'::uuid,
    '10000000-0000-4000-8000-000000000017'::uuid,
    '10000000-0000-4000-8000-000000000018'::uuid,
    '10000000-0000-4000-8000-000000000019'::uuid,
    '10000000-0000-4000-8000-000000000020'::uuid,
    '10000000-0000-4000-8000-000000000021'::uuid,
    '10000000-0000-4000-8000-000000000022'::uuid,
    '10000000-0000-4000-8000-000000000023'::uuid,
    '10000000-0000-4000-8000-000000000024'::uuid,
    '10000000-0000-4000-8000-000000000025'::uuid,
    '10000000-0000-4000-8000-000000000026'::uuid,
    '10000000-0000-4000-8000-000000000027'::uuid,
    '10000000-0000-4000-8000-000000000028'::uuid,
    '10000000-0000-4000-8000-000000000029'::uuid,
    '10000000-0000-4000-8000-000000000030'::uuid,
    '10000000-0000-4000-8000-000000000031'::uuid,
    '10000000-0000-4000-8000-000000000032'::uuid,
    '10000000-0000-4000-8000-000000000033'::uuid,
    '10000000-0000-4000-8000-000000000034'::uuid,
    '10000000-0000-4000-8000-000000000035'::uuid,
    '10000000-0000-4000-8000-000000000036'::uuid,
    '10000000-0000-4000-8000-000000000037'::uuid,
    '10000000-0000-4000-8000-000000000038'::uuid,
    '10000000-0000-4000-8000-000000000039'::uuid,
    '10000000-0000-4000-8000-000000000040'::uuid,
    '10000000-0000-4000-8000-000000000041'::uuid,
    '10000000-0000-4000-8000-000000000042'::uuid,
    '10000000-0000-4000-8000-000000000043'::uuid,
    '10000000-0000-4000-8000-000000000044'::uuid,
    '10000000-0000-4000-8000-000000000045'::uuid,
    '10000000-0000-4000-8000-000000000046'::uuid,
    '10000000-0000-4000-8000-000000000047'::uuid,
    '10000000-0000-4000-8000-000000000048'::uuid,
    '10000000-0000-4000-8000-000000000049'::uuid,
    '10000000-0000-4000-8000-000000000050'::uuid,
    '10000000-0000-4000-8000-000000000051'::uuid,
    '10000000-0000-4000-8000-000000000052'::uuid,
    '10000000-0000-4000-8000-000000000053'::uuid,
    '10000000-0000-4000-8000-000000000054'::uuid,
    '10000000-0000-4000-8000-000000000055'::uuid,
    '10000000-0000-4000-8000-000000000056'::uuid,
    '10000000-0000-4000-8000-000000000057'::uuid,
    '10000000-0000-4000-8000-000000000058'::uuid,
    '10000000-0000-4000-8000-000000000059'::uuid,
    '10000000-0000-4000-8000-000000000060'::uuid,
    '10000000-0000-4000-8000-000000000061'::uuid,
    '10000000-0000-4000-8000-000000000062'::uuid,
    '10000000-0000-4000-8000-000000000063'::uuid,
    '10000000-0000-4000-8000-000000000064'::uuid,
    '10000000-0000-4000-8000-000000000065'::uuid,
    '10000000-0000-4000-8000-000000000066'::uuid,
    '10000000-0000-4000-8000-000000000067'::uuid,
    '10000000-0000-4000-8000-000000000068'::uuid,
    '10000000-0000-4000-8000-000000000069'::uuid,
    '10000000-0000-4000-8000-000000000070'::uuid,
    '10000000-0000-4000-8000-000000000071'::uuid,
    '10000000-0000-4000-8000-000000000072'::uuid,
    '10000000-0000-4000-8000-000000000073'::uuid,
    '10000000-0000-4000-8000-000000000074'::uuid,
    '10000000-0000-4000-8000-000000000075'::uuid,
    '10000000-0000-4000-8000-000000000076'::uuid,
    '10000000-0000-4000-8000-000000000077'::uuid,
    '10000000-0000-4000-8000-000000000078'::uuid,
    '10000000-0000-4000-8000-000000000079'::uuid,
    '10000000-0000-4000-8000-000000000080'::uuid,
    '10000000-0000-4000-8000-000000000081'::uuid,
    '10000000-0000-4000-8000-000000000082'::uuid,
    '10000000-0000-4000-8000-000000000083'::uuid,
    '10000000-0000-4000-8000-000000000084'::uuid,
    '10000000-0000-4000-8000-000000000085'::uuid,
    '10000000-0000-4000-8000-000000000086'::uuid,
    '10000000-0000-4000-8000-000000000087'::uuid,
    '10000000-0000-4000-8000-000000000088'::uuid,
    '10000000-0000-4000-8000-000000000089'::uuid,
    '10000000-0000-4000-8000-000000000090'::uuid,
    '10000000-0000-4000-8000-000000000091'::uuid,
    '10000000-0000-4000-8000-000000000092'::uuid,
    '10000000-0000-4000-8000-000000000093'::uuid,
    '10000000-0000-4000-8000-000000000094'::uuid,
    '10000000-0000-4000-8000-000000000095'::uuid,
    '10000000-0000-4000-8000-000000000096'::uuid,
    '10000000-0000-4000-8000-000000000097'::uuid,
    '10000000-0000-4000-8000-000000000098'::uuid,
    '10000000-0000-4000-8000-000000000099'::uuid,
    '10000000-0000-4000-8000-000000000100'::uuid,
    '10000000-0000-4000-8000-000000000101'::uuid,
    '10000000-0000-4000-8000-000000000102'::uuid,
    '10000000-0000-4000-8000-000000000103'::uuid,
    '10000000-0000-4000-8000-000000000104'::uuid,
    '10000000-0000-4000-8000-000000000105'::uuid,
    '10000000-0000-4000-8000-000000000106'::uuid,
    '10000000-0000-4000-8000-000000000107'::uuid,
    '10000000-0000-4000-8000-000000000108'::uuid,
    '10000000-0000-4000-8000-000000000109'::uuid,
    '10000000-0000-4000-8000-000000000110'::uuid,
    '10000000-0000-4000-8000-000000000111'::uuid,
    '10000000-0000-4000-8000-000000000112'::uuid,
    '10000000-0000-4000-8000-000000000113'::uuid,
    '10000000-0000-4000-8000-000000000114'::uuid,
    '10000000-0000-4000-8000-000000000115'::uuid,
    '10000000-0000-4000-8000-000000000116'::uuid,
    '10000000-0000-4000-8000-000000000117'::uuid,
    '10000000-0000-4000-8000-000000000118'::uuid,
    '10000000-0000-4000-8000-000000000119'::uuid,
    '10000000-0000-4000-8000-000000000120'::uuid
);

insert into public.reports (
  id,
  title,
  description,
  category_id,
  citizen_id,
  status,
  priority,
  location,
  is_public,
  created_at
)
values
  (
    '10000000-0000-4000-8000-000000000001'::uuid,
    'Shtyllë ndriçimi e dëmtuar — rast sintetik 1',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9879, 41.9942),
      4326
    )::extensions.geography,
    false,
    '2026-03-13T11:43:58.508Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000002'::uuid,
    'Trotuar i dëmtuar — rast sintetik 2',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9792, 42.0031),
      4326
    )::extensions.geography,
    false,
    '2026-04-03T10:30:31.013Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000003'::uuid,
    'Mbeturina në hapësirë publike — rast sintetik 3',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9993, 41.9917),
      4326
    )::extensions.geography,
    false,
    '2026-05-01T18:10:57.385Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000004'::uuid,
    'Kontejner i mbushur — rast sintetik 4',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9902, 41.9862),
      4326
    )::extensions.geography,
    false,
    '2026-05-17T18:09:30.273Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000005'::uuid,
    'Shtyllë ndriçimi e dëmtuar — rast sintetik 5',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9806, 42.0195),
      4326
    )::extensions.geography,
    false,
    '2026-03-09T19:15:33.139Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000006'::uuid,
    'Ndriçim publik i fikur — rast sintetik 6',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0155, 41.9824),
      4326
    )::extensions.geography,
    false,
    '2026-01-10T21:21:59.254Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000007'::uuid,
    'Asfalt i dëmtuar — rast sintetik 7',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.994, 42.0093),
      4326
    )::extensions.geography,
    false,
    '2026-01-16T18:21:44.854Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000008'::uuid,
    'Nevojë për pastrim — rast sintetik 8',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0112, 42.0053),
      4326
    )::extensions.geography,
    false,
    '2026-04-25T07:58:32.774Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000009'::uuid,
    'Zonë publike pa ndriçim — rast sintetik 9',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0048, 42.0066),
      4326
    )::extensions.geography,
    false,
    '2026-05-27T13:12:28.185Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000010'::uuid,
    'Mbeturina në hapësirë publike — rast sintetik 10',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9837, 42.0177),
      4326
    )::extensions.geography,
    false,
    '2026-03-10T19:41:15.506Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000011'::uuid,
    'Shtyllë ndriçimi e dëmtuar — rast sintetik 11',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0198, 41.9956),
      4326
    )::extensions.geography,
    false,
    '2026-04-16T00:54:49.509Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000012'::uuid,
    'Zonë publike pa ndriçim — rast sintetik 12',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0153, 42.0061),
      4326
    )::extensions.geography,
    false,
    '2026-03-19T14:16:39.979Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000013'::uuid,
    'Sinjalistikë që mungon — rast sintetik 13',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9879, 42.0091),
      4326
    )::extensions.geography,
    false,
    '2026-04-14T17:27:55.797Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000014'::uuid,
    'Sinjalistikë që mungon — rast sintetik 14',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9751, 41.9895),
      4326
    )::extensions.geography,
    false,
    '2026-01-11T13:45:14.073Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000015'::uuid,
    'Nevojë për pastrim — rast sintetik 15',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9855, 41.9804),
      4326
    )::extensions.geography,
    false,
    '2026-02-06T13:48:16.673Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000016'::uuid,
    'Zonë publike pa ndriçim — rast sintetik 16',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9931, 41.9793),
      4326
    )::extensions.geography,
    false,
    '2026-01-20T09:21:22.944Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000017'::uuid,
    'Vijëzim i zbehur — rast sintetik 17',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9804, 41.9838),
      4326
    )::extensions.geography,
    false,
    '2026-02-18T04:19:55.788Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000018'::uuid,
    'Zonë publike pa ndriçim — rast sintetik 18',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.009, 41.995),
      4326
    )::extensions.geography,
    false,
    '2026-01-21T03:44:53.415Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000019'::uuid,
    'Vijëzim i zbehur — rast sintetik 19',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0008, 42.0035),
      4326
    )::extensions.geography,
    false,
    '2026-02-23T11:35:24.231Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000020'::uuid,
    'Vijëzim i zbehur — rast sintetik 20',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0249, 41.9987),
      4326
    )::extensions.geography,
    false,
    '2026-04-12T10:22:27.014Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000021'::uuid,
    'Nevojë për pastrim — rast sintetik 21',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9763, 42.0194),
      4326
    )::extensions.geography,
    false,
    '2026-01-20T15:47:59.340Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000022'::uuid,
    'Sinjalistikë që mungon — rast sintetik 22',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0028, 42.0035),
      4326
    )::extensions.geography,
    false,
    '2026-02-05T00:17:20.948Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000023'::uuid,
    'Sinjalistikë që mungon — rast sintetik 23',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9802, 41.9768),
      4326
    )::extensions.geography,
    false,
    '2026-04-05T10:17:17.901Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000024'::uuid,
    'Trotuar i dëmtuar — rast sintetik 24',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9818, 42.0225),
      4326
    )::extensions.geography,
    false,
    '2026-04-05T20:15:44.440Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000025'::uuid,
    'Mbeturina në hapësirë publike — rast sintetik 25',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.975, 42.0224),
      4326
    )::extensions.geography,
    false,
    '2026-04-05T10:07:13.339Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000026'::uuid,
    'Sinjalistikë që mungon — rast sintetik 26',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9885, 41.9881),
      4326
    )::extensions.geography,
    false,
    '2026-05-11T11:09:40.975Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000027'::uuid,
    'Ndriçim publik i fikur — rast sintetik 27',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0156, 42.0189),
      4326
    )::extensions.geography,
    false,
    '2026-04-17T23:59:02.136Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000028'::uuid,
    'Kontejner i mbushur — rast sintetik 28',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9763, 42.0012),
      4326
    )::extensions.geography,
    false,
    '2026-06-02T21:00:05.123Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000029'::uuid,
    'Mbeturina në hapësirë publike — rast sintetik 29',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9824, 41.9942),
      4326
    )::extensions.geography,
    false,
    '2026-03-17T01:02:15.339Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000030'::uuid,
    'Shenjë trafiku e dëmtuar — rast sintetik 30',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9839, 42.0085),
      4326
    )::extensions.geography,
    false,
    '2026-01-23T13:06:55.742Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000031'::uuid,
    'Shtyllë ndriçimi e dëmtuar — rast sintetik 31',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0231, 42.0249),
      4326
    )::extensions.geography,
    false,
    '2026-03-11T23:31:56.643Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000032'::uuid,
    'Kontejner i mbushur — rast sintetik 32',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9983, 42.0243),
      4326
    )::extensions.geography,
    false,
    '2026-05-04T09:09:35.479Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000033'::uuid,
    'Vijëzim i zbehur — rast sintetik 33',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0086, 41.9896),
      4326
    )::extensions.geography,
    false,
    '2026-03-11T19:03:29.146Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000034'::uuid,
    'Kontejner i mbushur — rast sintetik 34',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9848, 41.9863),
      4326
    )::extensions.geography,
    false,
    '2026-04-18T15:36:49.615Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000035'::uuid,
    'Zonë publike pa ndriçim — rast sintetik 35',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9761, 41.994),
      4326
    )::extensions.geography,
    false,
    '2026-04-30T07:44:28.534Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000036'::uuid,
    'Shenjë trafiku e dëmtuar — rast sintetik 36',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9869, 42.003),
      4326
    )::extensions.geography,
    false,
    '2026-03-14T09:33:55.432Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000037'::uuid,
    'Sinjalistikë që mungon — rast sintetik 37',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9847, 42.0137),
      4326
    )::extensions.geography,
    false,
    '2026-02-20T18:08:11.029Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000038'::uuid,
    'Mbeturina në hapësirë publike — rast sintetik 38',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0095, 42.0248),
      4326
    )::extensions.geography,
    false,
    '2026-05-23T05:23:46.388Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000039'::uuid,
    'Shtyllë ndriçimi e dëmtuar — rast sintetik 39',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.003, 42.0026),
      4326
    )::extensions.geography,
    false,
    '2026-05-07T07:24:10.103Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000040'::uuid,
    'Vijëzim i zbehur — rast sintetik 40',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.999, 41.9962),
      4326
    )::extensions.geography,
    false,
    '2026-03-20T20:59:03.533Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000041'::uuid,
    'Asfalt i dëmtuar — rast sintetik 41',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9802, 42.0247),
      4326
    )::extensions.geography,
    false,
    '2026-03-25T13:08:56.558Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000042'::uuid,
    'Gropë në segment rrugor — rast sintetik 42',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9881, 41.9877),
      4326
    )::extensions.geography,
    false,
    '2026-03-16T10:44:29.710Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000043'::uuid,
    'Ndriçim publik i fikur — rast sintetik 43',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9905, 42.0226),
      4326
    )::extensions.geography,
    false,
    '2026-05-11T04:33:12.215Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000044'::uuid,
    'Ndriçim publik i fikur — rast sintetik 44',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9986, 42.0018),
      4326
    )::extensions.geography,
    false,
    '2026-02-04T09:41:00.201Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000045'::uuid,
    'Mbeturina në hapësirë publike — rast sintetik 45',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0189, 42.0228),
      4326
    )::extensions.geography,
    false,
    '2026-01-16T07:31:58.060Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000046'::uuid,
    'Gropë në segment rrugor — rast sintetik 46',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0022, 42.0146),
      4326
    )::extensions.geography,
    false,
    '2026-05-19T14:17:56.640Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000047'::uuid,
    'Mbeturina në hapësirë publike — rast sintetik 47',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9924, 41.9954),
      4326
    )::extensions.geography,
    false,
    '2026-05-02T07:20:03.339Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000048'::uuid,
    'Shenjë trafiku e dëmtuar — rast sintetik 48',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0047, 41.997),
      4326
    )::extensions.geography,
    false,
    '2026-03-07T12:44:59.087Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000049'::uuid,
    'Gropë në segment rrugor — rast sintetik 49',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.002, 42.0187),
      4326
    )::extensions.geography,
    false,
    '2026-03-23T08:27:42.711Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000050'::uuid,
    'Vijëzim i zbehur — rast sintetik 50',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9929, 42.013),
      4326
    )::extensions.geography,
    false,
    '2026-06-01T13:21:54.329Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000051'::uuid,
    'Asfalt i dëmtuar — rast sintetik 51',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0113, 41.9864),
      4326
    )::extensions.geography,
    false,
    '2026-02-04T10:49:44.192Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000052'::uuid,
    'Asfalt i dëmtuar — rast sintetik 52',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9956, 42.0233),
      4326
    )::extensions.geography,
    false,
    '2026-03-06T23:02:36.571Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000053'::uuid,
    'Asfalt i dëmtuar — rast sintetik 53',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0071, 41.9869),
      4326
    )::extensions.geography,
    false,
    '2026-02-24T12:56:21.244Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000054'::uuid,
    'Zonë publike pa ndriçim — rast sintetik 54',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0183, 41.9786),
      4326
    )::extensions.geography,
    false,
    '2026-01-05T16:28:49.822Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000055'::uuid,
    'Gropë në segment rrugor — rast sintetik 55',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9784, 42.0071),
      4326
    )::extensions.geography,
    false,
    '2026-03-18T00:15:08.011Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000056'::uuid,
    'Mbeturina në hapësirë publike — rast sintetik 56',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9825, 42.0241),
      4326
    )::extensions.geography,
    false,
    '2026-04-22T17:39:29.379Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000057'::uuid,
    'Shtyllë ndriçimi e dëmtuar — rast sintetik 57',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0003, 42.0218),
      4326
    )::extensions.geography,
    false,
    '2026-01-26T10:10:37.284Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000058'::uuid,
    'Nevojë për pastrim — rast sintetik 58',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0021, 42.0097),
      4326
    )::extensions.geography,
    false,
    '2026-05-08T23:13:22.988Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000059'::uuid,
    'Trotuar i dëmtuar — rast sintetik 59',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0233, 42.0036),
      4326
    )::extensions.geography,
    false,
    '2026-06-02T02:51:56.456Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000060'::uuid,
    'Vijëzim i zbehur — rast sintetik 60',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9757, 42.0081),
      4326
    )::extensions.geography,
    false,
    '2026-02-04T05:45:50.319Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000061'::uuid,
    'Zonë publike pa ndriçim — rast sintetik 61',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0037, 41.9767),
      4326
    )::extensions.geography,
    false,
    '2026-02-19T15:38:27.309Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000062'::uuid,
    'Asfalt i dëmtuar — rast sintetik 62',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9797, 41.9926),
      4326
    )::extensions.geography,
    false,
    '2026-05-03T04:04:12.577Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000063'::uuid,
    'Shtyllë ndriçimi e dëmtuar — rast sintetik 63',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.984, 42.0227),
      4326
    )::extensions.geography,
    false,
    '2026-05-29T20:59:41.129Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000064'::uuid,
    'Ndriçim publik i fikur — rast sintetik 64',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9808, 42.0194),
      4326
    )::extensions.geography,
    false,
    '2026-05-09T13:42:32.157Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000065'::uuid,
    'Mbeturina në hapësirë publike — rast sintetik 65',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9808, 41.9795),
      4326
    )::extensions.geography,
    false,
    '2026-05-04T02:08:01.240Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000066'::uuid,
    'Vijëzim i zbehur — rast sintetik 66',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.01, 41.9969),
      4326
    )::extensions.geography,
    false,
    '2026-05-29T11:12:25.398Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000067'::uuid,
    'Shenjë trafiku e dëmtuar — rast sintetik 67',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0237, 41.9815),
      4326
    )::extensions.geography,
    false,
    '2026-03-06T08:31:20.724Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000068'::uuid,
    'Gropë në segment rrugor — rast sintetik 68',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.024, 42.013),
      4326
    )::extensions.geography,
    false,
    '2026-05-04T15:15:09.603Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000069'::uuid,
    'Mbeturina në hapësirë publike — rast sintetik 69',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0068, 41.9799),
      4326
    )::extensions.geography,
    false,
    '2026-05-04T19:17:33.647Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000070'::uuid,
    'Gropë në segment rrugor — rast sintetik 70',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9826, 41.9854),
      4326
    )::extensions.geography,
    false,
    '2026-04-04T17:09:18.622Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000071'::uuid,
    'Asfalt i dëmtuar — rast sintetik 71',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9804, 42.0247),
      4326
    )::extensions.geography,
    false,
    '2026-04-26T23:14:03.804Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000072'::uuid,
    'Mbeturina në hapësirë publike — rast sintetik 72',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0176, 41.992),
      4326
    )::extensions.geography,
    false,
    '2026-02-03T00:48:29.428Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000073'::uuid,
    'Zonë publike pa ndriçim — rast sintetik 73',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0108, 41.9964),
      4326
    )::extensions.geography,
    false,
    '2026-01-19T18:52:35.586Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000074'::uuid,
    'Zonë publike pa ndriçim — rast sintetik 74',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0135, 42.0005),
      4326
    )::extensions.geography,
    false,
    '2026-04-04T08:05:45.215Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000075'::uuid,
    'Nevojë për pastrim — rast sintetik 75',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.991, 42.0218),
      4326
    )::extensions.geography,
    false,
    '2026-02-25T09:23:27.192Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000076'::uuid,
    'Trotuar i dëmtuar — rast sintetik 76',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9908, 41.9791),
      4326
    )::extensions.geography,
    false,
    '2026-03-04T13:33:58.712Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000077'::uuid,
    'Trotuar i dëmtuar — rast sintetik 77',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9845, 41.9927),
      4326
    )::extensions.geography,
    false,
    '2026-02-22T01:12:57.062Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000078'::uuid,
    'Sinjalistikë që mungon — rast sintetik 78',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9854, 42.0071),
      4326
    )::extensions.geography,
    false,
    '2026-05-23T12:45:52.491Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000079'::uuid,
    'Gropë në segment rrugor — rast sintetik 79',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9893, 42.0127),
      4326
    )::extensions.geography,
    false,
    '2026-03-04T02:54:00.001Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000080'::uuid,
    'Nevojë për pastrim — rast sintetik 80',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0218, 42.0057),
      4326
    )::extensions.geography,
    false,
    '2026-02-05T22:22:41.204Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000081'::uuid,
    'Vijëzim i zbehur — rast sintetik 81',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0157, 41.9784),
      4326
    )::extensions.geography,
    false,
    '2026-02-19T12:12:10.114Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000082'::uuid,
    'Shenjë trafiku e dëmtuar — rast sintetik 82',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0001, 41.9798),
      4326
    )::extensions.geography,
    false,
    '2026-05-11T05:47:23.790Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000083'::uuid,
    'Sinjalistikë që mungon — rast sintetik 83',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9961, 41.9792),
      4326
    )::extensions.geography,
    false,
    '2026-02-15T09:28:03.279Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000084'::uuid,
    'Gropë në segment rrugor — rast sintetik 84',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0211, 42.0142),
      4326
    )::extensions.geography,
    false,
    '2026-03-21T23:16:11.820Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000085'::uuid,
    'Asfalt i dëmtuar — rast sintetik 85',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0183, 41.9874),
      4326
    )::extensions.geography,
    false,
    '2026-04-25T18:11:42.524Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000086'::uuid,
    'Ndriçim publik i fikur — rast sintetik 86',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0236, 41.9881),
      4326
    )::extensions.geography,
    false,
    '2026-04-30T02:21:13.288Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000087'::uuid,
    'Gropë në segment rrugor — rast sintetik 87',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9762, 41.9758),
      4326
    )::extensions.geography,
    false,
    '2026-04-24T00:05:55.284Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000088'::uuid,
    'Kontejner i mbushur — rast sintetik 88',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9773, 41.9825),
      4326
    )::extensions.geography,
    false,
    '2026-01-10T11:27:59.257Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000089'::uuid,
    'Trotuar i dëmtuar — rast sintetik 89',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9923, 42.0029),
      4326
    )::extensions.geography,
    false,
    '2026-03-10T16:12:32.157Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000090'::uuid,
    'Trotuar i dëmtuar — rast sintetik 90',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0161, 41.9937),
      4326
    )::extensions.geography,
    false,
    '2026-04-24T07:02:43.920Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000091'::uuid,
    'Sinjalistikë që mungon — rast sintetik 91',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0032, 42.0226),
      4326
    )::extensions.geography,
    false,
    '2026-02-14T06:19:32.383Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000092'::uuid,
    'Sinjalistikë që mungon — rast sintetik 92',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.989, 41.9921),
      4326
    )::extensions.geography,
    false,
    '2026-01-06T11:47:46.735Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000093'::uuid,
    'Asfalt i dëmtuar — rast sintetik 93',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0101, 42.0099),
      4326
    )::extensions.geography,
    false,
    '2026-05-20T10:46:31.917Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000094'::uuid,
    'Trotuar i dëmtuar — rast sintetik 94',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0042, 41.988),
      4326
    )::extensions.geography,
    false,
    '2026-05-26T01:47:18.440Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000095'::uuid,
    'Asfalt i dëmtuar — rast sintetik 95',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9845, 42.0184),
      4326
    )::extensions.geography,
    false,
    '2026-05-19T03:32:15.571Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000096'::uuid,
    'Ndriçim publik i fikur — rast sintetik 96',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0212, 42.0219),
      4326
    )::extensions.geography,
    false,
    '2026-04-15T13:21:20.866Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000097'::uuid,
    'Trotuar i dëmtuar — rast sintetik 97',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9869, 42.017),
      4326
    )::extensions.geography,
    false,
    '2026-01-24T10:50:15.337Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000098'::uuid,
    'Shenjë trafiku e dëmtuar — rast sintetik 98',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0111, 42.0082),
      4326
    )::extensions.geography,
    false,
    '2026-06-04T07:42:33.597Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000099'::uuid,
    'Zonë publike pa ndriçim — rast sintetik 99',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0113, 42.0006),
      4326
    )::extensions.geography,
    false,
    '2026-04-22T08:47:12.627Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000100'::uuid,
    'Shtyllë ndriçimi e dëmtuar — rast sintetik 100',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9836, 42.0166),
      4326
    )::extensions.geography,
    false,
    '2026-03-27T08:18:18.645Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000101'::uuid,
    'Gropë në segment rrugor — rast sintetik 101',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0069, 42.0043),
      4326
    )::extensions.geography,
    false,
    '2026-05-22T02:03:32.788Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000102'::uuid,
    'Asfalt i dëmtuar — rast sintetik 102',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9769, 41.9865),
      4326
    )::extensions.geography,
    false,
    '2026-04-15T09:49:47.442Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000103'::uuid,
    'Zonë publike pa ndriçim — rast sintetik 103',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0099, 41.9887),
      4326
    )::extensions.geography,
    false,
    '2026-02-14T21:26:45.880Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000104'::uuid,
    'Zonë publike pa ndriçim — rast sintetik 104',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9939, 41.985),
      4326
    )::extensions.geography,
    false,
    '2026-05-18T16:40:22.567Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000105'::uuid,
    'Gropë në segment rrugor — rast sintetik 105',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9895, 42.0141),
      4326
    )::extensions.geography,
    false,
    '2026-04-26T11:55:28.315Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000106'::uuid,
    'Gropë në segment rrugor — rast sintetik 106',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0114, 41.9946),
      4326
    )::extensions.geography,
    false,
    '2026-02-11T07:27:09.757Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000107'::uuid,
    'Zonë publike pa ndriçim — rast sintetik 107',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9867, 42.0085),
      4326
    )::extensions.geography,
    false,
    '2026-05-12T05:05:35.612Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000108'::uuid,
    'Vijëzim i zbehur — rast sintetik 108',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9992, 42.0018),
      4326
    )::extensions.geography,
    false,
    '2026-04-13T21:02:33.871Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000109'::uuid,
    'Vijëzim i zbehur — rast sintetik 109',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9897, 42.016),
      4326
    )::extensions.geography,
    false,
    '2026-03-22T19:00:07.099Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000110'::uuid,
    'Kontejner i mbushur — rast sintetik 110',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9842, 42.0137),
      4326
    )::extensions.geography,
    false,
    '2026-06-01T15:07:05.610Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000111'::uuid,
    'Ndriçim publik i fikur — rast sintetik 111',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0155, 42.0112),
      4326
    )::extensions.geography,
    false,
    '2026-02-13T06:59:49.080Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000112'::uuid,
    'Ndriçim publik i fikur — rast sintetik 112',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9931, 41.9953),
      4326
    )::extensions.geography,
    false,
    '2026-03-14T16:59:53.906Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000113'::uuid,
    'Zonë publike pa ndriçim — rast sintetik 113',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9935, 41.9885),
      4326
    )::extensions.geography,
    false,
    '2026-03-22T03:44:43.542Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000114'::uuid,
    'Gropë në segment rrugor — rast sintetik 114',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(20.0217, 42.0175),
      4326
    )::extensions.geography,
    false,
    '2026-05-20T01:00:22.034Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000115'::uuid,
    'Vijëzim i zbehur — rast sintetik 115',
    'Përshkrim sintetik për kategorinë sinjalistikë. Nuk përfaqëson problem, person ose adresë reale.',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.986, 42.0099),
      4326
    )::extensions.geography,
    false,
    '2026-01-26T01:34:45.165Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000116'::uuid,
    'Ndriçim publik i fikur — rast sintetik 116',
    'Përshkrim sintetik për kategorinë ndriçim publik. Nuk përfaqëson problem, person ose adresë reale.',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9778, 42.0174),
      4326
    )::extensions.geography,
    false,
    '2026-02-28T19:12:03.620Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000117'::uuid,
    'Nevojë për pastrim — rast sintetik 117',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9782, 42.0229),
      4326
    )::extensions.geography,
    false,
    '2026-05-19T00:12:39.976Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000118'::uuid,
    'Nevojë për pastrim — rast sintetik 118',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000001'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9895, 42.0217),
      4326
    )::extensions.geography,
    false,
    '2026-03-09T07:39:27.832Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000119'::uuid,
    'Asfalt i dëmtuar — rast sintetik 119',
    'Përshkrim sintetik për kategorinë rrugë dhe gropa. Nuk përfaqëson problem, person ose adresë reale.',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.9874, 42.0213),
      4326
    )::extensions.geography,
    false,
    '2026-04-17T22:13:44.643Z'::timestamptz
  ),
  (
    '10000000-0000-4000-8000-000000000120'::uuid,
    'Nevojë për pastrim — rast sintetik 120',
    'Përshkrim sintetik për kategorinë mbeturina. Nuk përfaqëson problem, person ose adresë reale.',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(19.981, 42.0045),
      4326
    )::extensions.geography,
    false,
    '2026-02-17T00:58:31.184Z'::timestamptz
  );

update public.reports
set status = 'under_review'
where id in (
    '10000000-0000-4000-8000-000000000002'::uuid,
    '10000000-0000-4000-8000-000000000003'::uuid,
    '10000000-0000-4000-8000-000000000004'::uuid,
    '10000000-0000-4000-8000-000000000005'::uuid,
    '10000000-0000-4000-8000-000000000006'::uuid,
    '10000000-0000-4000-8000-000000000007'::uuid,
    '10000000-0000-4000-8000-000000000008'::uuid,
    '10000000-0000-4000-8000-000000000010'::uuid,
    '10000000-0000-4000-8000-000000000011'::uuid,
    '10000000-0000-4000-8000-000000000012'::uuid,
    '10000000-0000-4000-8000-000000000013'::uuid,
    '10000000-0000-4000-8000-000000000014'::uuid,
    '10000000-0000-4000-8000-000000000016'::uuid,
    '10000000-0000-4000-8000-000000000018'::uuid,
    '10000000-0000-4000-8000-000000000020'::uuid,
    '10000000-0000-4000-8000-000000000021'::uuid,
    '10000000-0000-4000-8000-000000000022'::uuid,
    '10000000-0000-4000-8000-000000000023'::uuid,
    '10000000-0000-4000-8000-000000000024'::uuid,
    '10000000-0000-4000-8000-000000000025'::uuid,
    '10000000-0000-4000-8000-000000000026'::uuid,
    '10000000-0000-4000-8000-000000000027'::uuid,
    '10000000-0000-4000-8000-000000000028'::uuid,
    '10000000-0000-4000-8000-000000000029'::uuid,
    '10000000-0000-4000-8000-000000000030'::uuid,
    '10000000-0000-4000-8000-000000000031'::uuid,
    '10000000-0000-4000-8000-000000000032'::uuid,
    '10000000-0000-4000-8000-000000000033'::uuid,
    '10000000-0000-4000-8000-000000000034'::uuid,
    '10000000-0000-4000-8000-000000000035'::uuid,
    '10000000-0000-4000-8000-000000000036'::uuid,
    '10000000-0000-4000-8000-000000000037'::uuid,
    '10000000-0000-4000-8000-000000000038'::uuid,
    '10000000-0000-4000-8000-000000000039'::uuid,
    '10000000-0000-4000-8000-000000000040'::uuid,
    '10000000-0000-4000-8000-000000000041'::uuid,
    '10000000-0000-4000-8000-000000000042'::uuid,
    '10000000-0000-4000-8000-000000000043'::uuid,
    '10000000-0000-4000-8000-000000000047'::uuid,
    '10000000-0000-4000-8000-000000000048'::uuid,
    '10000000-0000-4000-8000-000000000049'::uuid,
    '10000000-0000-4000-8000-000000000050'::uuid,
    '10000000-0000-4000-8000-000000000051'::uuid,
    '10000000-0000-4000-8000-000000000052'::uuid,
    '10000000-0000-4000-8000-000000000053'::uuid,
    '10000000-0000-4000-8000-000000000054'::uuid,
    '10000000-0000-4000-8000-000000000055'::uuid,
    '10000000-0000-4000-8000-000000000056'::uuid,
    '10000000-0000-4000-8000-000000000059'::uuid,
    '10000000-0000-4000-8000-000000000060'::uuid,
    '10000000-0000-4000-8000-000000000061'::uuid,
    '10000000-0000-4000-8000-000000000062'::uuid,
    '10000000-0000-4000-8000-000000000063'::uuid,
    '10000000-0000-4000-8000-000000000064'::uuid,
    '10000000-0000-4000-8000-000000000065'::uuid,
    '10000000-0000-4000-8000-000000000066'::uuid,
    '10000000-0000-4000-8000-000000000067'::uuid,
    '10000000-0000-4000-8000-000000000069'::uuid,
    '10000000-0000-4000-8000-000000000071'::uuid,
    '10000000-0000-4000-8000-000000000072'::uuid,
    '10000000-0000-4000-8000-000000000073'::uuid,
    '10000000-0000-4000-8000-000000000074'::uuid,
    '10000000-0000-4000-8000-000000000075'::uuid,
    '10000000-0000-4000-8000-000000000076'::uuid,
    '10000000-0000-4000-8000-000000000077'::uuid,
    '10000000-0000-4000-8000-000000000078'::uuid,
    '10000000-0000-4000-8000-000000000079'::uuid,
    '10000000-0000-4000-8000-000000000080'::uuid,
    '10000000-0000-4000-8000-000000000081'::uuid,
    '10000000-0000-4000-8000-000000000082'::uuid,
    '10000000-0000-4000-8000-000000000083'::uuid,
    '10000000-0000-4000-8000-000000000084'::uuid,
    '10000000-0000-4000-8000-000000000085'::uuid,
    '10000000-0000-4000-8000-000000000086'::uuid,
    '10000000-0000-4000-8000-000000000087'::uuid,
    '10000000-0000-4000-8000-000000000088'::uuid,
    '10000000-0000-4000-8000-000000000089'::uuid,
    '10000000-0000-4000-8000-000000000091'::uuid,
    '10000000-0000-4000-8000-000000000093'::uuid,
    '10000000-0000-4000-8000-000000000094'::uuid,
    '10000000-0000-4000-8000-000000000096'::uuid,
    '10000000-0000-4000-8000-000000000097'::uuid,
    '10000000-0000-4000-8000-000000000098'::uuid,
    '10000000-0000-4000-8000-000000000099'::uuid,
    '10000000-0000-4000-8000-000000000100'::uuid,
    '10000000-0000-4000-8000-000000000101'::uuid,
    '10000000-0000-4000-8000-000000000102'::uuid,
    '10000000-0000-4000-8000-000000000103'::uuid,
    '10000000-0000-4000-8000-000000000104'::uuid,
    '10000000-0000-4000-8000-000000000105'::uuid,
    '10000000-0000-4000-8000-000000000106'::uuid,
    '10000000-0000-4000-8000-000000000107'::uuid,
    '10000000-0000-4000-8000-000000000108'::uuid,
    '10000000-0000-4000-8000-000000000109'::uuid,
    '10000000-0000-4000-8000-000000000110'::uuid,
    '10000000-0000-4000-8000-000000000111'::uuid,
    '10000000-0000-4000-8000-000000000112'::uuid,
    '10000000-0000-4000-8000-000000000113'::uuid,
    '10000000-0000-4000-8000-000000000114'::uuid,
    '10000000-0000-4000-8000-000000000115'::uuid,
    '10000000-0000-4000-8000-000000000117'::uuid,
    '10000000-0000-4000-8000-000000000118'::uuid,
    '10000000-0000-4000-8000-000000000119'::uuid,
    '10000000-0000-4000-8000-000000000120'::uuid
);

update public.reports
set
  status = 'rejected',
  rejected_reason = 'Refuzim sintetik për demonstrim.'
where id in (
    '10000000-0000-4000-8000-000000000003'::uuid,
    '10000000-0000-4000-8000-000000000011'::uuid,
    '10000000-0000-4000-8000-000000000016'::uuid,
    '10000000-0000-4000-8000-000000000026'::uuid,
    '10000000-0000-4000-8000-000000000027'::uuid,
    '10000000-0000-4000-8000-000000000033'::uuid,
    '10000000-0000-4000-8000-000000000040'::uuid,
    '10000000-0000-4000-8000-000000000043'::uuid,
    '10000000-0000-4000-8000-000000000047'::uuid,
    '10000000-0000-4000-8000-000000000051'::uuid,
    '10000000-0000-4000-8000-000000000054'::uuid,
    '10000000-0000-4000-8000-000000000061'::uuid,
    '10000000-0000-4000-8000-000000000064'::uuid,
    '10000000-0000-4000-8000-000000000069'::uuid,
    '10000000-0000-4000-8000-000000000075'::uuid,
    '10000000-0000-4000-8000-000000000079'::uuid,
    '10000000-0000-4000-8000-000000000089'::uuid,
    '10000000-0000-4000-8000-000000000091'::uuid,
    '10000000-0000-4000-8000-000000000106'::uuid,
    '10000000-0000-4000-8000-000000000118'::uuid,
    '10000000-0000-4000-8000-000000000119'::uuid
);

update public.reports
set
  status = 'assigned',
  department_id = (
    select c.department_id
    from public.categories c
    where c.id = reports.category_id
  )
where id in (
    '10000000-0000-4000-8000-000000000002'::uuid,
    '10000000-0000-4000-8000-000000000004'::uuid,
    '10000000-0000-4000-8000-000000000005'::uuid,
    '10000000-0000-4000-8000-000000000006'::uuid,
    '10000000-0000-4000-8000-000000000008'::uuid,
    '10000000-0000-4000-8000-000000000010'::uuid,
    '10000000-0000-4000-8000-000000000012'::uuid,
    '10000000-0000-4000-8000-000000000013'::uuid,
    '10000000-0000-4000-8000-000000000018'::uuid,
    '10000000-0000-4000-8000-000000000020'::uuid,
    '10000000-0000-4000-8000-000000000021'::uuid,
    '10000000-0000-4000-8000-000000000023'::uuid,
    '10000000-0000-4000-8000-000000000024'::uuid,
    '10000000-0000-4000-8000-000000000025'::uuid,
    '10000000-0000-4000-8000-000000000028'::uuid,
    '10000000-0000-4000-8000-000000000030'::uuid,
    '10000000-0000-4000-8000-000000000031'::uuid,
    '10000000-0000-4000-8000-000000000032'::uuid,
    '10000000-0000-4000-8000-000000000035'::uuid,
    '10000000-0000-4000-8000-000000000036'::uuid,
    '10000000-0000-4000-8000-000000000038'::uuid,
    '10000000-0000-4000-8000-000000000039'::uuid,
    '10000000-0000-4000-8000-000000000041'::uuid,
    '10000000-0000-4000-8000-000000000042'::uuid,
    '10000000-0000-4000-8000-000000000049'::uuid,
    '10000000-0000-4000-8000-000000000050'::uuid,
    '10000000-0000-4000-8000-000000000052'::uuid,
    '10000000-0000-4000-8000-000000000053'::uuid,
    '10000000-0000-4000-8000-000000000055'::uuid,
    '10000000-0000-4000-8000-000000000056'::uuid,
    '10000000-0000-4000-8000-000000000059'::uuid,
    '10000000-0000-4000-8000-000000000062'::uuid,
    '10000000-0000-4000-8000-000000000063'::uuid,
    '10000000-0000-4000-8000-000000000065'::uuid,
    '10000000-0000-4000-8000-000000000067'::uuid,
    '10000000-0000-4000-8000-000000000071'::uuid,
    '10000000-0000-4000-8000-000000000072'::uuid,
    '10000000-0000-4000-8000-000000000073'::uuid,
    '10000000-0000-4000-8000-000000000076'::uuid,
    '10000000-0000-4000-8000-000000000077'::uuid,
    '10000000-0000-4000-8000-000000000078'::uuid,
    '10000000-0000-4000-8000-000000000081'::uuid,
    '10000000-0000-4000-8000-000000000082'::uuid,
    '10000000-0000-4000-8000-000000000084'::uuid,
    '10000000-0000-4000-8000-000000000086'::uuid,
    '10000000-0000-4000-8000-000000000088'::uuid,
    '10000000-0000-4000-8000-000000000093'::uuid,
    '10000000-0000-4000-8000-000000000094'::uuid,
    '10000000-0000-4000-8000-000000000096'::uuid,
    '10000000-0000-4000-8000-000000000097'::uuid,
    '10000000-0000-4000-8000-000000000098'::uuid,
    '10000000-0000-4000-8000-000000000099'::uuid,
    '10000000-0000-4000-8000-000000000100'::uuid,
    '10000000-0000-4000-8000-000000000101'::uuid,
    '10000000-0000-4000-8000-000000000102'::uuid,
    '10000000-0000-4000-8000-000000000103'::uuid,
    '10000000-0000-4000-8000-000000000104'::uuid,
    '10000000-0000-4000-8000-000000000105'::uuid,
    '10000000-0000-4000-8000-000000000107'::uuid,
    '10000000-0000-4000-8000-000000000108'::uuid,
    '10000000-0000-4000-8000-000000000109'::uuid,
    '10000000-0000-4000-8000-000000000110'::uuid,
    '10000000-0000-4000-8000-000000000111'::uuid,
    '10000000-0000-4000-8000-000000000112'::uuid,
    '10000000-0000-4000-8000-000000000113'::uuid,
    '10000000-0000-4000-8000-000000000114'::uuid,
    '10000000-0000-4000-8000-000000000115'::uuid,
    '10000000-0000-4000-8000-000000000117'::uuid,
    '10000000-0000-4000-8000-000000000120'::uuid
);

update public.reports
set status = 'in_progress'
where id in (
    '10000000-0000-4000-8000-000000000002'::uuid,
    '10000000-0000-4000-8000-000000000005'::uuid,
    '10000000-0000-4000-8000-000000000006'::uuid,
    '10000000-0000-4000-8000-000000000010'::uuid,
    '10000000-0000-4000-8000-000000000012'::uuid,
    '10000000-0000-4000-8000-000000000018'::uuid,
    '10000000-0000-4000-8000-000000000020'::uuid,
    '10000000-0000-4000-8000-000000000021'::uuid,
    '10000000-0000-4000-8000-000000000024'::uuid,
    '10000000-0000-4000-8000-000000000028'::uuid,
    '10000000-0000-4000-8000-000000000030'::uuid,
    '10000000-0000-4000-8000-000000000031'::uuid,
    '10000000-0000-4000-8000-000000000036'::uuid,
    '10000000-0000-4000-8000-000000000038'::uuid,
    '10000000-0000-4000-8000-000000000039'::uuid,
    '10000000-0000-4000-8000-000000000041'::uuid,
    '10000000-0000-4000-8000-000000000049'::uuid,
    '10000000-0000-4000-8000-000000000050'::uuid,
    '10000000-0000-4000-8000-000000000052'::uuid,
    '10000000-0000-4000-8000-000000000053'::uuid,
    '10000000-0000-4000-8000-000000000055'::uuid,
    '10000000-0000-4000-8000-000000000056'::uuid,
    '10000000-0000-4000-8000-000000000062'::uuid,
    '10000000-0000-4000-8000-000000000063'::uuid,
    '10000000-0000-4000-8000-000000000065'::uuid,
    '10000000-0000-4000-8000-000000000071'::uuid,
    '10000000-0000-4000-8000-000000000072'::uuid,
    '10000000-0000-4000-8000-000000000076'::uuid,
    '10000000-0000-4000-8000-000000000077'::uuid,
    '10000000-0000-4000-8000-000000000081'::uuid,
    '10000000-0000-4000-8000-000000000084'::uuid,
    '10000000-0000-4000-8000-000000000086'::uuid,
    '10000000-0000-4000-8000-000000000088'::uuid,
    '10000000-0000-4000-8000-000000000093'::uuid,
    '10000000-0000-4000-8000-000000000094'::uuid,
    '10000000-0000-4000-8000-000000000097'::uuid,
    '10000000-0000-4000-8000-000000000098'::uuid,
    '10000000-0000-4000-8000-000000000099'::uuid,
    '10000000-0000-4000-8000-000000000100'::uuid,
    '10000000-0000-4000-8000-000000000102'::uuid,
    '10000000-0000-4000-8000-000000000103'::uuid,
    '10000000-0000-4000-8000-000000000104'::uuid,
    '10000000-0000-4000-8000-000000000105'::uuid,
    '10000000-0000-4000-8000-000000000107'::uuid,
    '10000000-0000-4000-8000-000000000108'::uuid,
    '10000000-0000-4000-8000-000000000109'::uuid,
    '10000000-0000-4000-8000-000000000112'::uuid,
    '10000000-0000-4000-8000-000000000114'::uuid,
    '10000000-0000-4000-8000-000000000115'::uuid,
    '10000000-0000-4000-8000-000000000117'::uuid,
    '10000000-0000-4000-8000-000000000120'::uuid
);

update public.reports
set
  status = 'resolved',
  resolution_notes = 'Zgjidhje sintetike për demonstrim.'
where id in (
    '10000000-0000-4000-8000-000000000002'::uuid,
    '10000000-0000-4000-8000-000000000005'::uuid,
    '10000000-0000-4000-8000-000000000006'::uuid,
    '10000000-0000-4000-8000-000000000010'::uuid,
    '10000000-0000-4000-8000-000000000012'::uuid,
    '10000000-0000-4000-8000-000000000018'::uuid,
    '10000000-0000-4000-8000-000000000020'::uuid,
    '10000000-0000-4000-8000-000000000021'::uuid,
    '10000000-0000-4000-8000-000000000028'::uuid,
    '10000000-0000-4000-8000-000000000036'::uuid,
    '10000000-0000-4000-8000-000000000039'::uuid,
    '10000000-0000-4000-8000-000000000041'::uuid,
    '10000000-0000-4000-8000-000000000049'::uuid,
    '10000000-0000-4000-8000-000000000050'::uuid,
    '10000000-0000-4000-8000-000000000052'::uuid,
    '10000000-0000-4000-8000-000000000055'::uuid,
    '10000000-0000-4000-8000-000000000056'::uuid,
    '10000000-0000-4000-8000-000000000062'::uuid,
    '10000000-0000-4000-8000-000000000063'::uuid,
    '10000000-0000-4000-8000-000000000071'::uuid,
    '10000000-0000-4000-8000-000000000072'::uuid,
    '10000000-0000-4000-8000-000000000076'::uuid,
    '10000000-0000-4000-8000-000000000081'::uuid,
    '10000000-0000-4000-8000-000000000086'::uuid,
    '10000000-0000-4000-8000-000000000088'::uuid,
    '10000000-0000-4000-8000-000000000093'::uuid,
    '10000000-0000-4000-8000-000000000094'::uuid,
    '10000000-0000-4000-8000-000000000099'::uuid,
    '10000000-0000-4000-8000-000000000100'::uuid,
    '10000000-0000-4000-8000-000000000102'::uuid,
    '10000000-0000-4000-8000-000000000103'::uuid,
    '10000000-0000-4000-8000-000000000104'::uuid,
    '10000000-0000-4000-8000-000000000105'::uuid,
    '10000000-0000-4000-8000-000000000108'::uuid,
    '10000000-0000-4000-8000-000000000109'::uuid,
    '10000000-0000-4000-8000-000000000115'::uuid,
    '10000000-0000-4000-8000-000000000117'::uuid,
    '10000000-0000-4000-8000-000000000120'::uuid
);

update public.reports
set status = 'reopened'
where id in (
    '10000000-0000-4000-8000-000000000002'::uuid,
    '10000000-0000-4000-8000-000000000006'::uuid,
    '10000000-0000-4000-8000-000000000010'::uuid,
    '10000000-0000-4000-8000-000000000028'::uuid,
    '10000000-0000-4000-8000-000000000036'::uuid,
    '10000000-0000-4000-8000-000000000039'::uuid,
    '10000000-0000-4000-8000-000000000056'::uuid,
    '10000000-0000-4000-8000-000000000072'::uuid,
    '10000000-0000-4000-8000-000000000081'::uuid,
    '10000000-0000-4000-8000-000000000094'::uuid,
    '10000000-0000-4000-8000-000000000103'::uuid,
    '10000000-0000-4000-8000-000000000105'::uuid,
    '10000000-0000-4000-8000-000000000117'::uuid,
    '10000000-0000-4000-8000-000000000120'::uuid
);

update public.reports
set
  is_public = true,
  public_title = title,
  public_summary = pg_catalog.left(description, 1000)
where id in (
    '10000000-0000-4000-8000-000000000002'::uuid,
    '10000000-0000-4000-8000-000000000003'::uuid,
    '10000000-0000-4000-8000-000000000004'::uuid,
    '10000000-0000-4000-8000-000000000005'::uuid,
    '10000000-0000-4000-8000-000000000006'::uuid,
    '10000000-0000-4000-8000-000000000007'::uuid,
    '10000000-0000-4000-8000-000000000008'::uuid,
    '10000000-0000-4000-8000-000000000010'::uuid,
    '10000000-0000-4000-8000-000000000011'::uuid,
    '10000000-0000-4000-8000-000000000012'::uuid,
    '10000000-0000-4000-8000-000000000013'::uuid,
    '10000000-0000-4000-8000-000000000014'::uuid,
    '10000000-0000-4000-8000-000000000016'::uuid,
    '10000000-0000-4000-8000-000000000018'::uuid,
    '10000000-0000-4000-8000-000000000020'::uuid,
    '10000000-0000-4000-8000-000000000021'::uuid,
    '10000000-0000-4000-8000-000000000022'::uuid,
    '10000000-0000-4000-8000-000000000023'::uuid,
    '10000000-0000-4000-8000-000000000024'::uuid,
    '10000000-0000-4000-8000-000000000025'::uuid,
    '10000000-0000-4000-8000-000000000026'::uuid,
    '10000000-0000-4000-8000-000000000027'::uuid,
    '10000000-0000-4000-8000-000000000028'::uuid,
    '10000000-0000-4000-8000-000000000029'::uuid,
    '10000000-0000-4000-8000-000000000030'::uuid,
    '10000000-0000-4000-8000-000000000031'::uuid,
    '10000000-0000-4000-8000-000000000032'::uuid,
    '10000000-0000-4000-8000-000000000033'::uuid,
    '10000000-0000-4000-8000-000000000034'::uuid,
    '10000000-0000-4000-8000-000000000035'::uuid,
    '10000000-0000-4000-8000-000000000036'::uuid,
    '10000000-0000-4000-8000-000000000037'::uuid,
    '10000000-0000-4000-8000-000000000038'::uuid,
    '10000000-0000-4000-8000-000000000039'::uuid,
    '10000000-0000-4000-8000-000000000040'::uuid,
    '10000000-0000-4000-8000-000000000041'::uuid,
    '10000000-0000-4000-8000-000000000042'::uuid,
    '10000000-0000-4000-8000-000000000043'::uuid,
    '10000000-0000-4000-8000-000000000047'::uuid,
    '10000000-0000-4000-8000-000000000048'::uuid,
    '10000000-0000-4000-8000-000000000049'::uuid,
    '10000000-0000-4000-8000-000000000050'::uuid,
    '10000000-0000-4000-8000-000000000051'::uuid,
    '10000000-0000-4000-8000-000000000052'::uuid,
    '10000000-0000-4000-8000-000000000053'::uuid,
    '10000000-0000-4000-8000-000000000054'::uuid,
    '10000000-0000-4000-8000-000000000055'::uuid,
    '10000000-0000-4000-8000-000000000056'::uuid,
    '10000000-0000-4000-8000-000000000059'::uuid,
    '10000000-0000-4000-8000-000000000060'::uuid,
    '10000000-0000-4000-8000-000000000061'::uuid,
    '10000000-0000-4000-8000-000000000062'::uuid,
    '10000000-0000-4000-8000-000000000063'::uuid,
    '10000000-0000-4000-8000-000000000064'::uuid,
    '10000000-0000-4000-8000-000000000065'::uuid,
    '10000000-0000-4000-8000-000000000066'::uuid,
    '10000000-0000-4000-8000-000000000067'::uuid,
    '10000000-0000-4000-8000-000000000069'::uuid,
    '10000000-0000-4000-8000-000000000071'::uuid,
    '10000000-0000-4000-8000-000000000072'::uuid,
    '10000000-0000-4000-8000-000000000073'::uuid,
    '10000000-0000-4000-8000-000000000074'::uuid,
    '10000000-0000-4000-8000-000000000075'::uuid,
    '10000000-0000-4000-8000-000000000076'::uuid,
    '10000000-0000-4000-8000-000000000077'::uuid,
    '10000000-0000-4000-8000-000000000078'::uuid,
    '10000000-0000-4000-8000-000000000079'::uuid,
    '10000000-0000-4000-8000-000000000080'::uuid,
    '10000000-0000-4000-8000-000000000081'::uuid,
    '10000000-0000-4000-8000-000000000082'::uuid,
    '10000000-0000-4000-8000-000000000083'::uuid,
    '10000000-0000-4000-8000-000000000084'::uuid,
    '10000000-0000-4000-8000-000000000085'::uuid,
    '10000000-0000-4000-8000-000000000086'::uuid,
    '10000000-0000-4000-8000-000000000087'::uuid,
    '10000000-0000-4000-8000-000000000088'::uuid,
    '10000000-0000-4000-8000-000000000089'::uuid,
    '10000000-0000-4000-8000-000000000091'::uuid,
    '10000000-0000-4000-8000-000000000093'::uuid,
    '10000000-0000-4000-8000-000000000094'::uuid,
    '10000000-0000-4000-8000-000000000096'::uuid,
    '10000000-0000-4000-8000-000000000097'::uuid,
    '10000000-0000-4000-8000-000000000098'::uuid,
    '10000000-0000-4000-8000-000000000099'::uuid,
    '10000000-0000-4000-8000-000000000100'::uuid,
    '10000000-0000-4000-8000-000000000101'::uuid,
    '10000000-0000-4000-8000-000000000102'::uuid,
    '10000000-0000-4000-8000-000000000103'::uuid,
    '10000000-0000-4000-8000-000000000104'::uuid,
    '10000000-0000-4000-8000-000000000105'::uuid,
    '10000000-0000-4000-8000-000000000106'::uuid,
    '10000000-0000-4000-8000-000000000107'::uuid,
    '10000000-0000-4000-8000-000000000108'::uuid,
    '10000000-0000-4000-8000-000000000109'::uuid,
    '10000000-0000-4000-8000-000000000110'::uuid,
    '10000000-0000-4000-8000-000000000111'::uuid,
    '10000000-0000-4000-8000-000000000112'::uuid,
    '10000000-0000-4000-8000-000000000113'::uuid,
    '10000000-0000-4000-8000-000000000114'::uuid,
    '10000000-0000-4000-8000-000000000115'::uuid,
    '10000000-0000-4000-8000-000000000117'::uuid,
    '10000000-0000-4000-8000-000000000118'::uuid,
    '10000000-0000-4000-8000-000000000119'::uuid,
    '10000000-0000-4000-8000-000000000120'::uuid
);

update public.reports as reports
set sla_due_at = seed_values.sla_due_at
from (
  values
    ('10000000-0000-4000-8000-000000000001'::uuid, '2026-03-14T11:43:58.508Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000002'::uuid, '2026-04-05T10:30:31.013Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000003'::uuid, '2026-05-02T18:10:57.385Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000004'::uuid, '2026-05-18T18:09:30.273Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000005'::uuid, '2026-03-10T19:15:33.139Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000006'::uuid, '2026-01-11T21:21:59.254Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000007'::uuid, '2026-01-18T18:21:44.854Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000008'::uuid, '2026-04-26T07:58:32.774Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000009'::uuid, '2026-05-28T13:12:28.185Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000010'::uuid, '2026-03-11T19:41:15.506Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000011'::uuid, '2026-04-17T00:54:49.509Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000012'::uuid, '2026-03-20T14:16:39.979Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000013'::uuid, '2026-04-17T17:27:55.797Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000014'::uuid, '2026-01-14T13:45:14.073Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000015'::uuid, '2026-02-07T13:48:16.673Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000016'::uuid, '2026-01-21T09:21:22.944Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000017'::uuid, '2026-02-21T04:19:55.788Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000018'::uuid, '2026-01-22T03:44:53.415Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000019'::uuid, '2026-02-26T11:35:24.231Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000020'::uuid, '2026-04-15T10:22:27.014Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000021'::uuid, '2026-01-21T15:47:59.340Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000022'::uuid, '2026-02-08T00:17:20.948Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000023'::uuid, '2026-04-08T10:17:17.901Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000024'::uuid, '2026-04-07T20:15:44.440Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000025'::uuid, '2026-04-06T10:07:13.339Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000026'::uuid, '2026-05-14T11:09:40.975Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000027'::uuid, '2026-04-18T23:59:02.136Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000028'::uuid, '2026-06-03T21:00:05.123Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000029'::uuid, '2026-03-18T01:02:15.339Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000030'::uuid, '2026-01-26T13:06:55.742Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000031'::uuid, '2026-03-12T23:31:56.643Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000032'::uuid, '2026-05-05T09:09:35.479Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000033'::uuid, '2026-03-14T19:03:29.146Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000034'::uuid, '2026-04-19T15:36:49.615Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000035'::uuid, '2026-05-01T07:44:28.534Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000036'::uuid, '2026-03-17T09:33:55.432Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000037'::uuid, '2026-02-23T18:08:11.029Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000038'::uuid, '2026-05-24T05:23:46.388Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000039'::uuid, '2026-05-08T07:24:10.103Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000040'::uuid, '2026-03-23T20:59:03.533Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000041'::uuid, '2026-03-27T13:08:56.558Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000042'::uuid, '2026-03-18T10:44:29.710Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000043'::uuid, '2026-05-12T04:33:12.215Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000044'::uuid, '2026-02-05T09:41:00.201Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000045'::uuid, '2026-01-17T07:31:58.060Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000046'::uuid, '2026-05-21T14:17:56.640Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000047'::uuid, '2026-05-03T07:20:03.339Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000048'::uuid, '2026-03-10T12:44:59.087Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000049'::uuid, '2026-03-25T08:27:42.711Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000050'::uuid, '2026-06-04T13:21:54.329Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000051'::uuid, '2026-02-06T10:49:44.192Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000052'::uuid, '2026-03-08T23:02:36.571Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000053'::uuid, '2026-02-26T12:56:21.244Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000054'::uuid, '2026-01-06T16:28:49.822Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000055'::uuid, '2026-03-20T00:15:08.011Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000056'::uuid, '2026-04-23T17:39:29.379Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000057'::uuid, '2026-01-27T10:10:37.284Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000058'::uuid, '2026-05-09T23:13:22.988Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000059'::uuid, '2026-06-04T02:51:56.456Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000060'::uuid, '2026-02-07T05:45:50.319Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000061'::uuid, '2026-02-20T15:38:27.309Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000062'::uuid, '2026-05-05T04:04:12.577Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000063'::uuid, '2026-05-30T20:59:41.129Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000064'::uuid, '2026-05-10T13:42:32.157Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000065'::uuid, '2026-05-05T02:08:01.240Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000066'::uuid, '2026-06-01T11:12:25.398Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000067'::uuid, '2026-03-09T08:31:20.724Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000068'::uuid, '2026-05-06T15:15:09.603Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000069'::uuid, '2026-05-05T19:17:33.647Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000070'::uuid, '2026-04-06T17:09:18.622Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000071'::uuid, '2026-04-28T23:14:03.804Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000072'::uuid, '2026-02-04T00:48:29.428Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000073'::uuid, '2026-01-20T18:52:35.586Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000074'::uuid, '2026-04-05T08:05:45.215Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000075'::uuid, '2026-02-26T09:23:27.192Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000076'::uuid, '2026-03-06T13:33:58.712Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000077'::uuid, '2026-02-24T01:12:57.062Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000078'::uuid, '2026-05-26T12:45:52.491Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000079'::uuid, '2026-03-06T02:54:00.001Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000080'::uuid, '2026-02-06T22:22:41.204Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000081'::uuid, '2026-02-22T12:12:10.114Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000082'::uuid, '2026-05-14T05:47:23.790Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000083'::uuid, '2026-02-18T09:28:03.279Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000084'::uuid, '2026-03-23T23:16:11.820Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000085'::uuid, '2026-04-27T18:11:42.524Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000086'::uuid, '2026-05-01T02:21:13.288Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000087'::uuid, '2026-04-26T00:05:55.284Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000088'::uuid, '2026-01-11T11:27:59.257Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000089'::uuid, '2026-03-12T16:12:32.157Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000090'::uuid, '2026-04-26T07:02:43.920Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000091'::uuid, '2026-02-17T06:19:32.383Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000092'::uuid, '2026-01-09T11:47:46.735Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000093'::uuid, '2026-05-22T10:46:31.917Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000094'::uuid, '2026-05-28T01:47:18.440Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000095'::uuid, '2026-05-21T03:32:15.571Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000096'::uuid, '2026-04-16T13:21:20.866Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000097'::uuid, '2026-01-26T10:50:15.337Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000098'::uuid, '2026-06-07T07:42:33.597Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000099'::uuid, '2026-04-23T08:47:12.627Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000100'::uuid, '2026-03-28T08:18:18.645Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000101'::uuid, '2026-05-24T02:03:32.788Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000102'::uuid, '2026-04-17T09:49:47.442Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000103'::uuid, '2026-02-15T21:26:45.880Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000104'::uuid, '2026-05-19T16:40:22.567Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000105'::uuid, '2026-04-28T11:55:28.315Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000106'::uuid, '2026-02-13T07:27:09.757Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000107'::uuid, '2026-05-13T05:05:35.612Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000108'::uuid, '2026-04-16T21:02:33.871Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000109'::uuid, '2026-03-25T19:00:07.099Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000110'::uuid, '2026-06-02T15:07:05.610Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000111'::uuid, '2026-02-14T06:59:49.080Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000112'::uuid, '2026-03-15T16:59:53.906Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000113'::uuid, '2026-03-23T03:44:43.542Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000114'::uuid, '2026-05-22T01:00:22.034Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000115'::uuid, '2026-01-29T01:34:45.165Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000116'::uuid, '2026-03-01T19:12:03.620Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000117'::uuid, '2026-05-20T00:12:39.976Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000118'::uuid, '2026-03-10T07:39:27.832Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000119'::uuid, '2026-04-19T22:13:44.643Z'::timestamptz),
    ('10000000-0000-4000-8000-000000000120'::uuid, '2026-02-18T00:58:31.184Z'::timestamptz)
) as seed_values(id, sla_due_at)
where reports.id = seed_values.id;

do $$
begin
  if (
    select count(*)
    from public.reports
    where id in (
    '10000000-0000-4000-8000-000000000001'::uuid,
    '10000000-0000-4000-8000-000000000002'::uuid,
    '10000000-0000-4000-8000-000000000003'::uuid,
    '10000000-0000-4000-8000-000000000004'::uuid,
    '10000000-0000-4000-8000-000000000005'::uuid,
    '10000000-0000-4000-8000-000000000006'::uuid,
    '10000000-0000-4000-8000-000000000007'::uuid,
    '10000000-0000-4000-8000-000000000008'::uuid,
    '10000000-0000-4000-8000-000000000009'::uuid,
    '10000000-0000-4000-8000-000000000010'::uuid,
    '10000000-0000-4000-8000-000000000011'::uuid,
    '10000000-0000-4000-8000-000000000012'::uuid,
    '10000000-0000-4000-8000-000000000013'::uuid,
    '10000000-0000-4000-8000-000000000014'::uuid,
    '10000000-0000-4000-8000-000000000015'::uuid,
    '10000000-0000-4000-8000-000000000016'::uuid,
    '10000000-0000-4000-8000-000000000017'::uuid,
    '10000000-0000-4000-8000-000000000018'::uuid,
    '10000000-0000-4000-8000-000000000019'::uuid,
    '10000000-0000-4000-8000-000000000020'::uuid,
    '10000000-0000-4000-8000-000000000021'::uuid,
    '10000000-0000-4000-8000-000000000022'::uuid,
    '10000000-0000-4000-8000-000000000023'::uuid,
    '10000000-0000-4000-8000-000000000024'::uuid,
    '10000000-0000-4000-8000-000000000025'::uuid,
    '10000000-0000-4000-8000-000000000026'::uuid,
    '10000000-0000-4000-8000-000000000027'::uuid,
    '10000000-0000-4000-8000-000000000028'::uuid,
    '10000000-0000-4000-8000-000000000029'::uuid,
    '10000000-0000-4000-8000-000000000030'::uuid,
    '10000000-0000-4000-8000-000000000031'::uuid,
    '10000000-0000-4000-8000-000000000032'::uuid,
    '10000000-0000-4000-8000-000000000033'::uuid,
    '10000000-0000-4000-8000-000000000034'::uuid,
    '10000000-0000-4000-8000-000000000035'::uuid,
    '10000000-0000-4000-8000-000000000036'::uuid,
    '10000000-0000-4000-8000-000000000037'::uuid,
    '10000000-0000-4000-8000-000000000038'::uuid,
    '10000000-0000-4000-8000-000000000039'::uuid,
    '10000000-0000-4000-8000-000000000040'::uuid,
    '10000000-0000-4000-8000-000000000041'::uuid,
    '10000000-0000-4000-8000-000000000042'::uuid,
    '10000000-0000-4000-8000-000000000043'::uuid,
    '10000000-0000-4000-8000-000000000044'::uuid,
    '10000000-0000-4000-8000-000000000045'::uuid,
    '10000000-0000-4000-8000-000000000046'::uuid,
    '10000000-0000-4000-8000-000000000047'::uuid,
    '10000000-0000-4000-8000-000000000048'::uuid,
    '10000000-0000-4000-8000-000000000049'::uuid,
    '10000000-0000-4000-8000-000000000050'::uuid,
    '10000000-0000-4000-8000-000000000051'::uuid,
    '10000000-0000-4000-8000-000000000052'::uuid,
    '10000000-0000-4000-8000-000000000053'::uuid,
    '10000000-0000-4000-8000-000000000054'::uuid,
    '10000000-0000-4000-8000-000000000055'::uuid,
    '10000000-0000-4000-8000-000000000056'::uuid,
    '10000000-0000-4000-8000-000000000057'::uuid,
    '10000000-0000-4000-8000-000000000058'::uuid,
    '10000000-0000-4000-8000-000000000059'::uuid,
    '10000000-0000-4000-8000-000000000060'::uuid,
    '10000000-0000-4000-8000-000000000061'::uuid,
    '10000000-0000-4000-8000-000000000062'::uuid,
    '10000000-0000-4000-8000-000000000063'::uuid,
    '10000000-0000-4000-8000-000000000064'::uuid,
    '10000000-0000-4000-8000-000000000065'::uuid,
    '10000000-0000-4000-8000-000000000066'::uuid,
    '10000000-0000-4000-8000-000000000067'::uuid,
    '10000000-0000-4000-8000-000000000068'::uuid,
    '10000000-0000-4000-8000-000000000069'::uuid,
    '10000000-0000-4000-8000-000000000070'::uuid,
    '10000000-0000-4000-8000-000000000071'::uuid,
    '10000000-0000-4000-8000-000000000072'::uuid,
    '10000000-0000-4000-8000-000000000073'::uuid,
    '10000000-0000-4000-8000-000000000074'::uuid,
    '10000000-0000-4000-8000-000000000075'::uuid,
    '10000000-0000-4000-8000-000000000076'::uuid,
    '10000000-0000-4000-8000-000000000077'::uuid,
    '10000000-0000-4000-8000-000000000078'::uuid,
    '10000000-0000-4000-8000-000000000079'::uuid,
    '10000000-0000-4000-8000-000000000080'::uuid,
    '10000000-0000-4000-8000-000000000081'::uuid,
    '10000000-0000-4000-8000-000000000082'::uuid,
    '10000000-0000-4000-8000-000000000083'::uuid,
    '10000000-0000-4000-8000-000000000084'::uuid,
    '10000000-0000-4000-8000-000000000085'::uuid,
    '10000000-0000-4000-8000-000000000086'::uuid,
    '10000000-0000-4000-8000-000000000087'::uuid,
    '10000000-0000-4000-8000-000000000088'::uuid,
    '10000000-0000-4000-8000-000000000089'::uuid,
    '10000000-0000-4000-8000-000000000090'::uuid,
    '10000000-0000-4000-8000-000000000091'::uuid,
    '10000000-0000-4000-8000-000000000092'::uuid,
    '10000000-0000-4000-8000-000000000093'::uuid,
    '10000000-0000-4000-8000-000000000094'::uuid,
    '10000000-0000-4000-8000-000000000095'::uuid,
    '10000000-0000-4000-8000-000000000096'::uuid,
    '10000000-0000-4000-8000-000000000097'::uuid,
    '10000000-0000-4000-8000-000000000098'::uuid,
    '10000000-0000-4000-8000-000000000099'::uuid,
    '10000000-0000-4000-8000-000000000100'::uuid,
    '10000000-0000-4000-8000-000000000101'::uuid,
    '10000000-0000-4000-8000-000000000102'::uuid,
    '10000000-0000-4000-8000-000000000103'::uuid,
    '10000000-0000-4000-8000-000000000104'::uuid,
    '10000000-0000-4000-8000-000000000105'::uuid,
    '10000000-0000-4000-8000-000000000106'::uuid,
    '10000000-0000-4000-8000-000000000107'::uuid,
    '10000000-0000-4000-8000-000000000108'::uuid,
    '10000000-0000-4000-8000-000000000109'::uuid,
    '10000000-0000-4000-8000-000000000110'::uuid,
    '10000000-0000-4000-8000-000000000111'::uuid,
    '10000000-0000-4000-8000-000000000112'::uuid,
    '10000000-0000-4000-8000-000000000113'::uuid,
    '10000000-0000-4000-8000-000000000114'::uuid,
    '10000000-0000-4000-8000-000000000115'::uuid,
    '10000000-0000-4000-8000-000000000116'::uuid,
    '10000000-0000-4000-8000-000000000117'::uuid,
    '10000000-0000-4000-8000-000000000118'::uuid,
    '10000000-0000-4000-8000-000000000119'::uuid,
    '10000000-0000-4000-8000-000000000120'::uuid
    )
  ) <> 120 then
    raise exception 'SYNTHETIC_REPORT_SEED_COUNT_MISMATCH';
  end if;

  if exists (
    select 1
    from public.reports
    where id in (
    '10000000-0000-4000-8000-000000000001'::uuid,
    '10000000-0000-4000-8000-000000000002'::uuid,
    '10000000-0000-4000-8000-000000000003'::uuid,
    '10000000-0000-4000-8000-000000000004'::uuid,
    '10000000-0000-4000-8000-000000000005'::uuid,
    '10000000-0000-4000-8000-000000000006'::uuid,
    '10000000-0000-4000-8000-000000000007'::uuid,
    '10000000-0000-4000-8000-000000000008'::uuid,
    '10000000-0000-4000-8000-000000000009'::uuid,
    '10000000-0000-4000-8000-000000000010'::uuid,
    '10000000-0000-4000-8000-000000000011'::uuid,
    '10000000-0000-4000-8000-000000000012'::uuid,
    '10000000-0000-4000-8000-000000000013'::uuid,
    '10000000-0000-4000-8000-000000000014'::uuid,
    '10000000-0000-4000-8000-000000000015'::uuid,
    '10000000-0000-4000-8000-000000000016'::uuid,
    '10000000-0000-4000-8000-000000000017'::uuid,
    '10000000-0000-4000-8000-000000000018'::uuid,
    '10000000-0000-4000-8000-000000000019'::uuid,
    '10000000-0000-4000-8000-000000000020'::uuid,
    '10000000-0000-4000-8000-000000000021'::uuid,
    '10000000-0000-4000-8000-000000000022'::uuid,
    '10000000-0000-4000-8000-000000000023'::uuid,
    '10000000-0000-4000-8000-000000000024'::uuid,
    '10000000-0000-4000-8000-000000000025'::uuid,
    '10000000-0000-4000-8000-000000000026'::uuid,
    '10000000-0000-4000-8000-000000000027'::uuid,
    '10000000-0000-4000-8000-000000000028'::uuid,
    '10000000-0000-4000-8000-000000000029'::uuid,
    '10000000-0000-4000-8000-000000000030'::uuid,
    '10000000-0000-4000-8000-000000000031'::uuid,
    '10000000-0000-4000-8000-000000000032'::uuid,
    '10000000-0000-4000-8000-000000000033'::uuid,
    '10000000-0000-4000-8000-000000000034'::uuid,
    '10000000-0000-4000-8000-000000000035'::uuid,
    '10000000-0000-4000-8000-000000000036'::uuid,
    '10000000-0000-4000-8000-000000000037'::uuid,
    '10000000-0000-4000-8000-000000000038'::uuid,
    '10000000-0000-4000-8000-000000000039'::uuid,
    '10000000-0000-4000-8000-000000000040'::uuid,
    '10000000-0000-4000-8000-000000000041'::uuid,
    '10000000-0000-4000-8000-000000000042'::uuid,
    '10000000-0000-4000-8000-000000000043'::uuid,
    '10000000-0000-4000-8000-000000000044'::uuid,
    '10000000-0000-4000-8000-000000000045'::uuid,
    '10000000-0000-4000-8000-000000000046'::uuid,
    '10000000-0000-4000-8000-000000000047'::uuid,
    '10000000-0000-4000-8000-000000000048'::uuid,
    '10000000-0000-4000-8000-000000000049'::uuid,
    '10000000-0000-4000-8000-000000000050'::uuid,
    '10000000-0000-4000-8000-000000000051'::uuid,
    '10000000-0000-4000-8000-000000000052'::uuid,
    '10000000-0000-4000-8000-000000000053'::uuid,
    '10000000-0000-4000-8000-000000000054'::uuid,
    '10000000-0000-4000-8000-000000000055'::uuid,
    '10000000-0000-4000-8000-000000000056'::uuid,
    '10000000-0000-4000-8000-000000000057'::uuid,
    '10000000-0000-4000-8000-000000000058'::uuid,
    '10000000-0000-4000-8000-000000000059'::uuid,
    '10000000-0000-4000-8000-000000000060'::uuid,
    '10000000-0000-4000-8000-000000000061'::uuid,
    '10000000-0000-4000-8000-000000000062'::uuid,
    '10000000-0000-4000-8000-000000000063'::uuid,
    '10000000-0000-4000-8000-000000000064'::uuid,
    '10000000-0000-4000-8000-000000000065'::uuid,
    '10000000-0000-4000-8000-000000000066'::uuid,
    '10000000-0000-4000-8000-000000000067'::uuid,
    '10000000-0000-4000-8000-000000000068'::uuid,
    '10000000-0000-4000-8000-000000000069'::uuid,
    '10000000-0000-4000-8000-000000000070'::uuid,
    '10000000-0000-4000-8000-000000000071'::uuid,
    '10000000-0000-4000-8000-000000000072'::uuid,
    '10000000-0000-4000-8000-000000000073'::uuid,
    '10000000-0000-4000-8000-000000000074'::uuid,
    '10000000-0000-4000-8000-000000000075'::uuid,
    '10000000-0000-4000-8000-000000000076'::uuid,
    '10000000-0000-4000-8000-000000000077'::uuid,
    '10000000-0000-4000-8000-000000000078'::uuid,
    '10000000-0000-4000-8000-000000000079'::uuid,
    '10000000-0000-4000-8000-000000000080'::uuid,
    '10000000-0000-4000-8000-000000000081'::uuid,
    '10000000-0000-4000-8000-000000000082'::uuid,
    '10000000-0000-4000-8000-000000000083'::uuid,
    '10000000-0000-4000-8000-000000000084'::uuid,
    '10000000-0000-4000-8000-000000000085'::uuid,
    '10000000-0000-4000-8000-000000000086'::uuid,
    '10000000-0000-4000-8000-000000000087'::uuid,
    '10000000-0000-4000-8000-000000000088'::uuid,
    '10000000-0000-4000-8000-000000000089'::uuid,
    '10000000-0000-4000-8000-000000000090'::uuid,
    '10000000-0000-4000-8000-000000000091'::uuid,
    '10000000-0000-4000-8000-000000000092'::uuid,
    '10000000-0000-4000-8000-000000000093'::uuid,
    '10000000-0000-4000-8000-000000000094'::uuid,
    '10000000-0000-4000-8000-000000000095'::uuid,
    '10000000-0000-4000-8000-000000000096'::uuid,
    '10000000-0000-4000-8000-000000000097'::uuid,
    '10000000-0000-4000-8000-000000000098'::uuid,
    '10000000-0000-4000-8000-000000000099'::uuid,
    '10000000-0000-4000-8000-000000000100'::uuid,
    '10000000-0000-4000-8000-000000000101'::uuid,
    '10000000-0000-4000-8000-000000000102'::uuid,
    '10000000-0000-4000-8000-000000000103'::uuid,
    '10000000-0000-4000-8000-000000000104'::uuid,
    '10000000-0000-4000-8000-000000000105'::uuid,
    '10000000-0000-4000-8000-000000000106'::uuid,
    '10000000-0000-4000-8000-000000000107'::uuid,
    '10000000-0000-4000-8000-000000000108'::uuid,
    '10000000-0000-4000-8000-000000000109'::uuid,
    '10000000-0000-4000-8000-000000000110'::uuid,
    '10000000-0000-4000-8000-000000000111'::uuid,
    '10000000-0000-4000-8000-000000000112'::uuid,
    '10000000-0000-4000-8000-000000000113'::uuid,
    '10000000-0000-4000-8000-000000000114'::uuid,
    '10000000-0000-4000-8000-000000000115'::uuid,
    '10000000-0000-4000-8000-000000000116'::uuid,
    '10000000-0000-4000-8000-000000000117'::uuid,
    '10000000-0000-4000-8000-000000000118'::uuid,
    '10000000-0000-4000-8000-000000000119'::uuid,
    '10000000-0000-4000-8000-000000000120'::uuid
    )
      and is_public = true
      and (
        public_location is null
        or extensions.st_distance(location, public_location) < 50
      )
  ) then
    raise exception 'SYNTHETIC_PUBLIC_LOCATION_NOT_GENERALIZED';
  end if;
end;
$$;

commit;
