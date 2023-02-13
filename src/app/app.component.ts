import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form: FormGroup;
  model: any;
  options: FormlyFormOptions;
  fields: FormlyFieldConfig[];
  schema = {
    title: 'Central Network',
    definitions: {
      regions: {
        type: 'string',
        enum: [
          'us-east-1',
          'us-west-1',
          'us-west-2',
          'ap-east-1',
          'ap-south-1',
          'ap-northeast-2',
          'ap-southeast-1',
          'ap-southeast-2',
          'ap-northeast-1',
          'ca-central-1',
          'cn-north-1',
          'cn-northwest-1',
          'eu-central-1',
          'eu-west-1',
          'eu-west-2',
          'eu-west-3',
          'eu-north-1',
          'sa-east-1',
          'us-gov-east-1',
          'us-gov-west-1',
        ],
      },
      panorama_instance_specs: {
        type: 'string',
        enum: ['recommended', 'minimum'],
      },
      firewall_instance_specs: {
        type: 'string',
        enum: ['low', 'medium', 'max'],
      },
      root_ca_key_algorithm: {
        type: 'string',
        enum: ['RSA_4096', 'RSA_2048', 'EC_256', 'EC_384'],
      },
      app_connector_instance_specs: {
        type: 'string',
        enum: ['recommended', 'minimum'],
      },
      zscaler_connector_instance_specs: {
        type: 'string',
        enum: ['low', 'medium', 'max'],
      },
      app_connector_upgrade_days: {
        type: 'string',
        enum: [
          'MONDAY',
          'TUESDAY',
          'WEDNESDAY',
          'THURSDAY',
          'FRIDAY',
          'SATURDAY',
          'SUNDAY',
        ],
      },
    },
    type: 'object',
    properties: {
      deploymentEnvironment: {
        type: 'array',
        title: 'Deployment Parameters',
        items: {
          type: 'object',
          properties: {
            environmentName: {
              const: 'main',
            },
            customDevOps: {
              type: 'object',
              properties: {
                isCustomDevOps: {
                  const: true,
                },
                app_account_id: {
                  type: 'string',
                  cannotBeUpdated: true,
                  title: 'Application Deployment Account Id',
                  description: 'Account Id to deploy the Application within',
                  pattern: '^[0-9]{12}$',
                },
                pipeline_account_id: {
                  type: 'string',
                  cannotBeUpdated: true,
                  title: 'Pipeline Account Id',
                  description: 'Account Id to deploy the Pipeline',
                  pattern: '^[0-9]{12}$',
                },
              },
              required: ['app_account_id', 'pipeline_account_id'],
            },
            general: {
              type: 'object',
              title: 'General Parameters',
              properties: {
                AppName: {
                  type: 'string',
                  cannotBeUpdated: true,
                  title: 'Application Name',
                  description: 'Identifies the name of the application',
                  default: 'Central-Network',
                  pattern: '^[A-Za-z][A-Za-z0-9-]*$',
                },
                NamePrefix: {
                  type: 'string',
                  cannotBeUpdated: true,
                  title: 'Name Prefix',
                  description:
                    'Appended a prefix to resources to have unique names',
                  default: 'SCF',
                  pattern: '^[A-Za-z][A-Za-z0-9-]*$',
                },
                OrgUnitId: {
                  type: 'string',
                  cannotBeUpdated: true,
                  title: 'Organization Unit Id',
                  description: 'The Id of the organizational unit',
                  pattern: '^ou-[0-9a-z]{4,32}-[a-z0-9]{8,32}$',
                },
                OrgId: {
                  const: 'notbeingused',
                },
                PrimaryOperatingRegion: {
                  type: 'string',
                  cannotBeUpdated: true,
                  title: 'Application Deployment Region',
                  description: 'The primary region you are operating in',
                  $ref: '#/definitions/regions',
                },
                ProductOwner: {
                  type: 'string',
                  cannotBeUpdated: false,
                  title: 'Service Catalog Product Owner',
                  description:
                    'Product owner name used for Service Catalog products',
                  pattern: '^[A-Za-z][A-Za-z0-9 ]*$',
                },
                ServiceCatalogProviderName: {
                  type: 'string',
                  cannotBeUpdated: false,
                  title: 'Service Catalog Provider Name',
                  description: 'Service catalog provider name',
                  default: 'Accenture Cloud Security',
                  pattern: '^[A-Za-z][A-Za-z0-9 ]*$',
                },
                SourceRepository: {
                  const: 'CODECOMMIT',
                },
                RepositoryName: {
                  type: 'string',
                  cannotBeUpdated: true,
                  title: 'Source Repository Name',
                  description:
                    'Name of the repository where source, configuration files are stored',
                  maxLength: 100,
                  pattern: '^[A-Za-z0-9_-]*$',
                },
                EnabledRegions: {
                  type: 'array',
                  title: 'Enabled Regions',
                  cannotBeUpdated: false,
                  description:
                    'List of all regions the network will be operating in',
                  items: {
                    type: 'string',
                    $ref: '#/definitions/regions',
                  },
                  minItems: 1,
                  uniqueItems: true,
                },
                Environments: {
                  type: 'array',
                  cannotBeUpdated: false,
                  title: 'Environments *',
                  description:
                    'List of environments. Note: The Environments specified here must match the environments specified in the application',
                  items: {
                    type: 'string',
                    pattern: '^\\S+$',
                  },
                  minItems: 1,
                  uniqueItems: true,
                },
                DeployVPCForImageBuilder: {
                  type: 'boolean',
                  cannotBeUpdated: false,
                  title: 'Deploy VPC for Image Builder',
                  description:
                    'Toggle to create and tag a Spoke VPC for compatibility with SCF Endpoint Security product',
                  default: true,
                },
                GlobalCloudCIDRList: {
                  title: 'Global Cloud CIDRs *',
                  description: 'List of CIDRs used for the primary pool',
                  type: 'array',
                  cannotBeUpdated: false,
                  items: {
                    type: 'string',
                    pattern:
                      '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(/([0-9]|[1-2][0-9]|3[0-2]))$',
                  },
                  uniqueItems: true,
                  required: true,
                },
                RegionCIDRNetmaskLength: {
                  type: 'string',
                  cannotBeUpdated: false,
                  title: 'Region CIDR Network Mask Length',
                  description:
                    'The CIDR size you wish to allocate to the region pools (ex: 16 is /16)',
                  pattern: '^[0-9]{2}$',
                  default: '16',
                },
                DefaultRegionCIDRQuantity: {
                  type: 'number',
                  cannotBeUpdated: false,
                  title: 'Default Region CIDR Quantity',
                  description:
                    'The number of region pools per region. Note: When 3 CIDR blocks are running out, you will need to manually add another CIDR block allocated to that region',
                  pattern: '^[0-9]{2}$',
                  default: 3,
                },
                EnableGlobalSG: {
                  type: 'boolean',
                  cannotBeUpdated: false,
                  title: 'Enable Global Security Group',
                  description: 'Toggle to enable global security group',
                  default: true,
                },
                DeployFirewallEndpoints: {
                  type: 'boolean',
                  cannotBeUpdated: false,
                  title: 'Deploy Firewall Endpoints',
                  description: 'Toggle to deploy firewall endpoints',
                  default: true,
                },
                FirewallVersion: {
                  type: 'string',
                  cannotBeUpdated: false,
                  title: 'Firewall Version',
                  description:
                    'It is recommended not to change the Firewall version. This is because the version numbers are dynamically found using this input. If it is changed, the Panorama will be completely redeployed.',
                  default: '10.1.3',
                },
                FirewallInstanceSpecs: {
                  type: 'array',
                  cannotBeUpdated: false,
                  title: 'Firewall Instance Specifications',
                  description:
                    'Available compute levels: low=25gbit/sec & minimal compute; medium=25gbit/sec; max=50gbit/s',
                  default: 'low',
                  $ref: '#/definitions/firewall_instance_specs',
                },
                DeployPrivateRootCA: {
                  type: 'boolean',
                  cannotBeUpdated: false,
                  title: 'Deploy Private Root CA',
                  description: 'Toggle to deploy private root CA',
                  default: true,
                },
                VPCEndptIngressCIDR: {
                  type: 'string',
                  cannotBeUpdated: false,
                  title: 'VPC Endpoint Ingress CIDR',
                  description: 'The CIDR for centralized endpoint ingress',
                  pattern:
                    '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(/([0-9]|[1-2][0-9]|3[0-2]))$',
                  default: '10.0.0.0/8',
                },
                SendLogsToLogAggregationPlatform: {
                  type: 'boolean',
                  cannotBeUpdated: false,
                  title: 'Send Logs To Log Aggregation Platform (LAP)',
                  description:
                    'Toggle connection to SCF LAP.  SCF LAP must be deployed in order for SendLogsToLogAggregationPlatform to be enabled',
                  default: false,
                },
                ServiceQuotaAutomation: {
                  type: 'object',
                  title: 'Service Quota Automation Parameters',
                  properties: {
                    ScheduleRateInDays: {
                      type: 'number',
                      cannotBeUpdated: false,
                      title: 'Schedule Rate In Days',
                      description: '',
                      minimum: 0,
                      default: 7,
                    },
                    QuotaCodes: {
                      type: 'array',
                      title: 'Quota Codes Parameters',
                      items: {
                        type: 'object',
                        properties: {
                          Resource: {
                            type: 'string',
                            cannotBeUpdated: false,
                            title: 'Resource',
                            description: '',
                            pattern: '^\\S+$',
                          },
                          QuotaCode: {
                            type: 'string',
                            cannotBeUpdated: false,
                            title: 'Quota code',
                            description: '',
                            pattern: '^\\S+$',
                          },
                          IntervalToCheck: {
                            type: 'number',
                            cannotBeUpdated: false,
                            title: 'Interval to Check',
                            description: '',
                            default: 5,
                            minimum: 0,
                          },
                        },
                        required: ['Resource', 'QuotaCode'],
                      },
                      default: [
                        {
                          Resource: 'routeTableRoutes',
                          QuotaCode: 'L-93826ACB',
                          IntervalToCheck: 5,
                        },
                        {
                          Resource: 'vpc',
                          QuotaCode: 'L-F678F1CE',
                          IntervalToCheck: 5,
                        },
                        {
                          Resource: 'vpcInterfaceEndpoint',
                          QuotaCode: 'L-29B6F2EB',
                          IntervalToCheck: 5,
                        },
                        {
                          Resource: 'subnetsShared',
                          QuotaCode: 'L-4A6CEE66',
                          IntervalToCheck: 9,
                        },
                        {
                          Resource: 'tgwAttachments',
                          QuotaCode: 'L-E0233F82',
                          IntervalToCheck: 5,
                        },
                        {
                          Resource: 'gatewayVpcEndpoints',
                          QuotaCode: 'L-1B52E74A',
                          IntervalToCheck: 5,
                        },
                      ],
                      uniqueItems: true,
                    },
                  },
                  required: ['ScheduleRateInDays', 'QuotaCodes'],
                },
                GlobalIngress: {
                  type: 'object',
                  title: 'Global Ingress Parameters',
                  properties: {
                    Enabled: {
                      type: 'boolean',
                      cannotBeUpdated: false,
                      title: 'Enable Global Ingress',
                      description: '',
                      default: true,
                    },
                  },
                  dependencies: {
                    Enabled: {
                      oneOf: [
                        {
                          properties: {
                            Enabled: {
                              const: true,
                            },
                            AllowedCidrs: {
                              title: 'Allowed CIDRs *',
                              description:
                                'List of allowed CIDRs to come through the global load balancer. This is for testing purposes',
                              type: 'array',
                              cannotBeUpdated: false,
                              items: {
                                type: 'string',
                                pattern:
                                  '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(/([0-9]|[1-2][0-9]|3[0-2]))$',
                              },
                              uniqueItems: true,
                            },
                          },
                          required: ['AllowedCidrs'],
                        },
                      ],
                    },
                  },
                },
                EnableGlobalWaf: {
                  type: 'boolean',
                  cannotBeUpdated: false,
                  title: 'Enable Global WAF',
                  description: 'Toggle whether to enable Global WAF',
                  default: false,
                },
                EnablePanorama: {
                  type: 'boolean',
                  cannotBeUpdated: false,
                  title: 'Enable Panorama',
                  description:
                    'Begin with EnablePanorama set to false (unchecked) so the underlying infrastructure can first deploy successfully. Once it has deployed successfully without the nested stack, set the toggle to true (checked) and commit and push the Panorama deployment',
                  default: false,
                },
                PaloAltoLicensingAPIKey: {
                  type: 'string',
                  cannotBeUpdated: false,
                  title: 'Palo Alto Licensing API Key',
                  pattern: '^\\S+$',
                },
                DeployTestNetwork: {
                  type: 'boolean',
                  cannotBeUpdated: false,
                  title: 'Deploy Test Network',
                  description: 'Toggle test network for checking traffic flow',
                  default: false,
                },
                DeploySSNetwork: {
                  type: 'boolean',
                  cannotBeUpdated: false,
                  title: 'Deploy Shared Services Network',
                  description: 'Toggle to deploy Shared Services Network',
                  default: false,
                },
                DeployCentralDNS: {
                  type: 'boolean',
                  cannotBeUpdated: false,
                  title: 'Deploy Central DNS',
                  description: 'Toggle Central DNS VPC',
                  default: true,
                },
              },
              dependencies: {
                EnableGlobalSG: {
                  oneOf: [
                    {
                      properties: {
                        EnableGlobalSG: {
                          const: true,
                        },
                        FMSSecurityGroupsRemediationEnabled: {
                          type: 'boolean',
                          cannotBeUpdated: false,
                          title: 'Enable FMS Security Group Remediation',
                          description:
                            'Toggle whether Firewall Manager findings should be automatically remediated',
                          default: false,
                        },
                      },
                    },
                  ],
                },
                EnablePanorama: {
                  oneOf: [
                    {
                      properties: {
                        EnablePanorama: {
                          const: true,
                        },
                        PanoramaVersion: {
                          type: 'string',
                          cannotBeUpdated: false,
                          title: 'Panorama Version',
                          description:
                            'It is recommended not to change the Panorama version. This is because the version numbers are dynamically found using this input. If it is changed, the Panorama will be completely redeployed.',
                          default: '10.1.3-h1',
                          pattern: '^\\S+$',
                        },
                        PanoramaSerialPrimary: {
                          type: 'string',
                          cannotBeUpdated: false,
                          title: 'Panorama Serial Primary',
                          description:
                            'The serial number for the primary Panorama',
                          pattern: '^\\S+$',
                        },
                        PanoramaSerialSecondary: {
                          type: 'string',
                          cannotBeUpdated: false,
                          title: 'Panorama Serial Secondary',
                          description:
                            'The serial number for the secondary Panorama',
                          pattern: '^\\S+$',
                        },
                        PanoramaDedicatedLogCollectorsEnabled: {
                          type: 'boolean',
                          cannotBeUpdated: false,
                          title: 'Enable Panorama Dedicated Log Collectors',
                          description:
                            'Toggle Panorama Dedicated Log Collectors',
                          default: true,
                        },
                        PanoramaInstanceSpecs: {
                          type: 'array',
                          cannotBeUpdated: false,
                          title: 'Panorama Instance Specifications',
                          description:
                            'Run Panorama on 4xLarge or 8xLarge instances. 4xLarge is “minimum” and 8xLarge is “recommended” according to Palo Alto best practices.',
                          default: 'recommended',
                          $ref: '#/definitions/panorama_instance_specs',
                        },
                        PanoramaHAMode: {
                          type: 'boolean',
                          cannotBeUpdated: false,
                          title: 'Panorama HA mode',
                          description: 'Toggle Panorama to be highly available',
                          default: true,
                        },
                        PanoAdminAccessCidrs: {
                          title: 'Panorama Admin Access CIDRs',
                          description:
                            'List of CIDRs that are allowed to access Panorama',
                          type: 'array',
                          cannotBeUpdated: false,
                          items: {
                            type: 'string',
                            pattern:
                              '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(/([0-9]|[1-2][0-9]|3[0-2]))$',
                          },
                          uniqueItems: true,
                        },
                        PanoAdminInternalAccessCidrs: {
                          title: 'Panorama Admin Internal Access CIDRs',
                          description:
                            'List of internal CIDRs that are allowed to access Panorama',
                          type: 'array',
                          cannotBeUpdated: false,
                          items: {
                            type: 'string',
                            pattern:
                              '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(/([0-9]|[1-2][0-9]|3[0-2]))$',
                          },
                          uniqueItems: true,
                        },
                        DeployExternalPanoramaBackdoor: {
                          type: 'boolean',
                          cannotBeUpdated: false,
                          title: 'Deploy External Panorama Backdoor',
                          default: true,
                        },
                      },
                      required: [
                        'PanoAdminAccessCidrs',
                        'PanoAdminInternalAccessCidrs',
                        'PanoramaVersion',
                        'PanoramaSerialPrimary',
                        'PanoramaSerialSecondary',
                      ],
                    },
                  ],
                },
                DeployTestNetwork: {
                  oneOf: [
                    {
                      properties: {
                        DeployTestNetwork: {
                          const: true,
                        },
                        TestNetworkAccount: {
                          type: 'string',
                          cannotBeUpdated: false,
                          title: 'Test Network Account',
                          description:
                            'The account the test network is shared to',
                          pattern: '^[0-9]{12}$',
                        },
                      },
                      required: ['TestNetworkAccount'],
                    },
                  ],
                },
                DeploySSNetwork: {
                  oneOf: [
                    {
                      properties: {
                        DeploySSNetwork: {
                          const: true,
                        },
                        SharedServicesAccount: {
                          type: 'string',
                          cannotBeUpdated: true,
                          title: 'Shared Services Account',
                          description:
                            'The account ID of the Shared Services account',
                          pattern: '^[0-9]{12}$',
                        },
                      },
                      required: ['SharedServicesAccount'],
                    },
                  ],
                },
                EnableGlobalWaf: {
                  oneOf: [
                    {
                      properties: {
                        EnableGlobalWaf: {
                          const: true,
                        },
                        GlobalWafOUs: {
                          title:
                            'List of Organization Unit Ids used for Global WAF *',
                          type: 'array',
                          cannotBeUpdated: false,
                          items: {
                            type: 'string',
                            pattern: '^ou-[0-9a-z]{4,32}-[a-z0-9]{8,32}$',
                          },
                          uniqueItems: true,
                        },
                        GlobalWafWhiteListIps: {
                          title:
                            'List of Global WAF IPs to be whitelisted/enabled',
                          type: 'array',
                          cannotBeUpdated: false,
                          items: {
                            type: 'string',
                            pattern:
                              '^([0-9]{1,3}\\.){3}[0-9]{1,3}(\\/([0-9]|[1-2][0-9]|3[0-2]))?$',
                          },
                          uniqueItems: true,
                        },
                        GlobalWafBlackListIps: {
                          title:
                            'List of Global WAF IPs to be blacklisted/blocked',
                          type: 'array',
                          cannotBeUpdated: false,
                          items: {
                            type: 'string',
                            pattern:
                              '^([0-9]{1,3}\\.){3}[0-9]{1,3}(\\/([0-9]|[1-2][0-9]|3[0-2]))?$',
                          },
                          uniqueItems: true,
                        },
                      },
                      required: ['GlobalWafOUs'],
                    },
                  ],
                },
                DeployPrivateRootCA: {
                  oneOf: [
                    {
                      properties: {
                        DeployPrivateRootCA: {
                          const: true,
                        },
                        RootCAName: {
                          type: 'string',
                          cannotBeUpdated: false,
                          title: 'Root CA Name',
                          description:
                            'The root name of the Certificate Authority',
                          default: 'scf.com',
                          pattern: '^\\S+$',
                        },
                        RootCAKeyAlgorithm: {
                          type: 'string',
                          cannotBeUpdated: false,
                          title: 'Root CA Key Algorithm',
                          description:
                            'The options for key algorithms are “RSA_2048”, “EC_256”, “EC_384”, “RSA_4096”',
                          default: 'RSA_4096',
                          pattern: '^\\S+$',
                        },
                        RootCAValidityInYears: {
                          type: 'number',
                          cannotBeUpdated: false,
                          title: 'Root CA Validity in Years',
                          description:
                            'Indicate how many years the Certificate Authority is valid',
                          default: 30,
                          minimum: 1,
                        },
                      },
                      required: [
                        'RootCAName',
                        'RootCAKeyAlgorithm',
                        'RootCAValidityInYears',
                      ],
                    },
                  ],
                },
                DeployCentralDNS: {
                  oneOf: [
                    {
                      properties: {
                        DeployCentralDNS: {
                          const: true,
                        },
                        GlobalPHZDomainName: {
                          type: 'string',
                          cannotBeUpdated: false,
                          title: 'Global PHZ Domain Name',
                          description:
                            'The domain name for your private hosted zone',
                          default: 'aws.scf.com',
                          pattern:
                            '^(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][a-zA-Z0-9-_]{1,61}[a-zA-Z0-9]))\\.([a-zA-Z]{2,6}|[a-zA-Z0-9-]{2,30}\\.[a-zA-Z]{2,3})$',
                        },
                        DNSIngressCIDR: {
                          type: 'string',
                          cannotBeUpdated: false,
                          title: 'DNS Ingress CIDR',
                          description:
                            'The CIDR range that is allowed to talk to private DNS',
                          pattern:
                            '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(/([0-9]|[1-2][0-9]|3[0-2]))$',
                        },
                        EnableReverseDNS: {
                          type: 'boolean',
                          cannotBeUpdated: false,
                          title: 'Enable Reverse DNS',
                          description:
                            'Toggle to enable reverse DNS which resolves an IP address back to its domain name',
                          default: true,
                        },
                        CentralVPCEndpoints: {
                          type: 'array',
                          title: 'Central VPC Endpoint Parameters',
                          description:
                            'Toggle the VPC endpoints you would like to deploy. It is possible that the deployment may face issues due to too many resources being deployed at once. To avoid this, you can stagger the deployment by disabling/unchecking some of the Central VPC Endpoints and enabling them in a separate commit and push to the repository. If it still fails to provision, retrying may be the solution',
                          items: {
                            type: 'object',
                            properties: {
                              CloudWatch: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable CloudWatch',
                                default: false,
                              },
                              CodeCommit: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable CodeCommit',
                                default: false,
                              },
                              CodeCommitGit: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable CodeCommitGit',
                                default: false,
                              },
                              CodeBuild: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable CodeBuild',
                                default: false,
                              },
                              CodePipeline: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable CodePipeline',
                                default: false,
                              },
                              EC2: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable EC2',
                                default: false,
                              },
                              EC2ImageBuilder: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable EC2 Image Builder',
                                default: false,
                              },
                              EC2Message: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable EC2 Message',
                                default: false,
                              },
                              EFS: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable EFS',
                                default: false,
                              },
                              FSx: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable FSx',
                                default: true,
                              },
                              KinesisFirehose: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable Kinesis Firehose',
                                default: false,
                              },
                              RDS: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable RDS',
                                default: false,
                              },
                              RDSData: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable RDS Data',
                                default: false,
                              },
                              S3: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable S3',
                                default: false,
                              },
                              SecretsManager: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable Secrets Manager',
                                default: false,
                              },
                              SSM: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable SSM',
                                default: false,
                              },
                              SSMMessage: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable SSM Message',
                                default: false,
                              },
                              STS: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable STS',
                                default: false,
                              },
                              Athena: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable Athena',
                                default: false,
                              },
                              DataSync: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable DataSync',
                                default: false,
                              },
                              ECRDkr: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable ECRDkr',
                                default: false,
                              },
                              ECRApi: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable ECR API',
                                default: false,
                              },
                              Lambda: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable Lambda',
                                default: false,
                              },
                              KMS: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable KMS',
                                default: false,
                              },
                              CloudHSMV2: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable CloudHSM',
                                default: false,
                              },
                              SQS: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable SQS',
                                default: false,
                              },
                              ElastiCache: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable ElasticCache',
                                default: false,
                              },
                              ElastiCacheFIPS: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable ElasticCache FIPS',
                                default: false,
                              },
                              MemoryDB: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable Memory DB',
                                default: false,
                              },
                              ELB: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable ELB',
                                default: false,
                              },
                              CodeCommitFIPS: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable CodeCommit FIPS',
                                default: false,
                              },
                              CodeBuildFIPS: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable CodeBuild FIPS',
                                default: false,
                              },
                              EFSFIPS: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable EFS FIPS',
                                default: false,
                              },
                              FSxFIPS: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable FSx FIPS',
                                default: false,
                              },
                            },
                          },
                        },
                      },
                      dependencies: {
                        EnableReverseDNS: {
                          oneOf: [
                            {
                              properties: {
                                EnableReverseDNS: {
                                  const: true,
                                },
                                GlobalReversePHZDomainName: {
                                  type: 'string',
                                  cannotBeUpdated: false,
                                  title: 'Global Reverse PHZ Domain Name',
                                  description:
                                    'The domain name for the reverse DNS IP address lookup',
                                  default: '10.in-addr.arpa',
                                },
                              },
                              required: ['GlobalReversePHZDomainName'],
                            },
                          ],
                        },
                      },
                      required: [
                        'GlobalPHZDomainName',
                        'DNSIngressCIDR',
                        'CentralVPCEndpoints',
                      ],
                    },
                  ],
                },
              },
              required: [
                'AppName',
                'NamePrefix',
                'PrimaryOperatingRegion',
                'ServiceCatalogProviderName',
                'RepositoryName',
                'EnabledRegions',
                'Environments',
                'GlobalCloudCIDRList',
                'OrgUnitId',
                'FirewallVersion',
                'VPCEndptIngressCIDR',
                'ServiceQuotaAutomation',
                'GlobalIngress',
              ],
            },
            regionalParameters: {
              title: 'Regional Parameters',
              type: 'array',
              items: {
                properties: {
                  regionName: {
                    type: 'string',
                    cannotBeUpdated: false,
                    title: 'Region Name',
                    description: 'Region to deploy specific parameters to',
                    $ref: '#/definitions/regions',
                  },
                  NetworkProperties: {
                    type: 'object',
                    title: 'Network Properties',
                    properties: {
                      EnableFirewalls: {
                        type: 'boolean',
                        cannotBeUpdated: false,
                        title: 'Enable Firewalls',
                        description:
                          "EnableFirewalls must first be 'unchecked' before the Panoramas are deployed. Only check when the Panorama is ready and configured, because they will not be able to connect with Panorama. It takes about 20 minutes for the Panorama to spin up successfully with no problems",
                        default: false,
                      },
                      TransitGatewayASN: {
                        type: 'string',
                        cannotBeUpdated: false,
                        title: 'Transit Gateway ASN',
                        description:
                          'The Transit Gateway (TGW) Autonomous System Number (ASN) as a string',
                        pattern: '^\\S+$',
                      },
                      DedicatedLogCollectorSerial: {
                        type: 'string',
                        cannotBeUpdated: false,
                        title: 'Dedicated Log Collector Serial Number',
                        pattern: '^\\S+$',
                      },
                      ResolverRules: {
                        title: 'Resolver Rules',
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            ResolverName: {
                              title: 'Resolver Name',
                              description:
                                'Resolver name used by resolver rule to determine where to route the traffic',
                              type: 'string',
                              cannotBeUpdated: false,
                              pattern: '^\\S+$',
                            },
                            ResolverDomain: {
                              title: 'Resolver Domain',
                              description:
                                'Domain used by resolver rule to determine where to route the traffic',
                              type: 'string',
                              cannotBeUpdated: false,
                              pattern:
                                '^(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][a-zA-Z0-9-_]{1,61}[a-zA-Z0-9]))\\.([a-zA-Z]{2,6}|[a-zA-Z0-9-]{2,30}\\.[a-zA-Z]{2,3})$',
                            },
                            ResolverTargetIps: {
                              title: 'Resolver Target IPs',
                              description:
                                'List of target IPs used by resolver rule to determine where to route the traffic',
                              type: 'array',
                              cannotBeUpdated: false,
                              items: {
                                type: 'string',
                                pattern:
                                  '^([0-9]{1,3}\\.){3}[0-9]{1,3}(\\/([0-9]|[1-2][0-9]|3[0-2]))?$',
                              },
                              uniqueItems: true,
                            },
                          },
                          required: [
                            'ResolverName',
                            'ResolverDomain',
                            'ResolverTargetIps',
                          ],
                        },
                      },
                      PeersTo: {
                        title: 'Peers To',
                        description: '',
                        type: 'array',
                        cannotBeUpdated: false,
                        items: {
                          type: 'string',
                          $ref: '#/definitions/regions',
                        },
                        minItems: 1,
                        uniqueItems: true,
                      },
                    },
                    dependencies: {
                      EnableFirewalls: {
                        oneOf: [
                          {
                            properties: {
                              EnableFirewalls: {
                                const: true,
                              },
                              FirewallAuthKey: {
                                type: 'string',
                                cannotBeUpdated: false,
                                title: 'Firewall Authorization Key',
                                description:
                                  'The firewall authorization key as a string',
                                pattern: '^\\S+$',
                              },
                            },
                            required: ['FirewallAuthKey'],
                          },
                        ],
                      },
                    },
                    required: [
                      'TransitGatewayASN',
                      'DedicatedLogCollectorSerial',
                    ],
                  },
                  ZscalerPrivateAccessProperties: {
                    type: 'object',
                    title: 'Zscaler Private Access Properties',
                    properties: {
                      ZpaEnabled: {
                        type: 'boolean',
                        title: 'Enable Zscaler Private Access',
                        default: false,
                      },
                    },
                    dependencies: {
                      ZpaEnabled: {
                        oneOf: [
                          {
                            properties: {
                              ZpaEnabled: {
                                const: true,
                              },
                              AppConnectorVersion: {
                                type: 'string',
                                cannotBeUpdated: false,
                                title: 'App Connector Version',
                                description:
                                  'The release date of the current app connector version',
                                default: '2022.03',
                                pattern: '^\\S+$',
                              },
                              AppConnectorInstanceSpecs: {
                                type: 'string',
                                cannotBeUpdated: false,
                                title: 'App Connector Instance Specifications',
                                description: '',
                                $ref: '#/definitions/app_connector_instance_specs',
                                default: 'recommended',
                              },
                              AppConnectorUpgradeDay: {
                                type: 'string',
                                cannotBeUpdated: false,
                                title: 'App Connector Upgrade Day',
                                description:
                                  'The desired upgrade day for the app connectors',
                                $ref: '#/definitions/app_connector_upgrade_days',
                                default: 'SUNDAY',
                              },
                              AppConnectorUpgradeTimeInSeconds: {
                                type: 'number',
                                cannotBeUpdated: false,
                                title: 'App Connector Upgrade Time In Seconds',
                                description:
                                  'The desired upgrade start time in seconds',
                                default: 75600,
                                minimum: 0,
                              },
                              AppConnectorKeyUsageLimit: {
                                type: 'number',
                                cannotBeUpdated: false,
                                title: 'App Connector Key Usage Limit',
                                description:
                                  'Amount of times App Connector Provisioning Key can be used',
                                default: 50,
                                minimum: 1,
                              },
                              ASGMaxSize: {
                                type: 'string',
                                cannotBeUpdated: false,
                                title: 'Auto Scaling Group Maximum Size',
                                description:
                                  'Maximimum number of App Connectors per Auto Scaling Group',
                                default: '12',
                                pattern: '^[0-9]+$',
                              },
                              ASGMinSize: {
                                type: 'string',
                                cannotBeUpdated: false,
                                title: 'Auto Scaling Group Minimum Size',
                                description:
                                  'Minimum number of App Connectors per Auto Scaling Group',
                                default: '6',
                                pattern: '^[0-9]+$',
                              },
                              ASGDesiredCapacity: {
                                type: 'string',
                                cannotBeUpdated: false,
                                title: 'Auto Scaling Group Desired Capacity',
                                description:
                                  'Desired number of initial App Connectors to deploy',
                                default: '6',
                                pattern: '^[0-9]+$',
                              },
                            },
                            required: [
                              'AppConnectorVersion',
                              'AppConnectorInstanceSpecs',
                              'AppConnectorUpgradeDay',
                              'AppConnectorUpgradeTimeInSeconds',
                              'AppConnectorKeyUsageLimit',
                              'ASGMaxSize',
                              'ASGMinSize',
                              'ASGDesiredCapacity',
                            ],
                          },
                        ],
                      },
                    },
                  },
                  ZscalerInternetAccessProperties: {
                    type: 'object',
                    title: 'Zscaler Internet Access Properties',
                    properties: {
                      Enabled: {
                        type: 'boolean',
                        title: 'Enable Zscaler Internet Access',
                        description: '',
                        default: false,
                      },
                    },
                    dependencies: {
                      Enabled: {
                        oneOf: [
                          {
                            properties: {
                              Enabled: {
                                const: true,
                              },
                              ZiaPolicyAsCodeEnabled: {
                                type: 'boolean',
                                cannotBeUpdated: false,
                                title: 'Enable Zia Policy As Code',
                                description:
                                  'Toggle to enable Zia Policy As Code',
                                default: true,
                              },
                              BaseUrl: {
                                type: 'string',
                                cannotBeUpdated: false,
                                title: 'Zscaler Internet Access Base URL',
                                description: '',
                                default: 'http://zsapi.zscalerthree.net',
                              },
                            },
                            required: ['ZiaPolicyAsCodeEnabled', 'BaseUrl'],
                          },
                        ],
                      },
                    },
                  },
                  ZscalerCloudConnector: {
                    type: 'object',
                    title: 'Zscaler Cloud Connector Properties',
                    properties: {
                      Enabled: {
                        type: 'boolean',
                        cannotBeUpdated: false,
                        title: 'Enable Zscaler Cloud Connector',
                        description: '',
                        default: false,
                      },
                    },
                    dependencies: {
                      Enabled: {
                        oneOf: [
                          {
                            properties: {
                              Enabled: {
                                const: true,
                              },
                              CloudConnectorProvisioningUrl: {
                                type: 'string',
                                cannotBeUpdated: false,
                                title: 'Cloud Connector Provisioning URL',
                                description: '',
                                default:
                                  'connector.zscalerthree.net/api/v1/provUrl?name=SCF-Lab',
                              },
                              InstanceSpecification: {
                                type: 'array',
                                cannotBeUpdated: false,
                                title:
                                  'Zscaler Cloud Connector Instance Specification',
                                description:
                                  'low=t3.medium, medium=m5.large, max=c5.large',
                                $ref: '#/definitions/zscaler_connector_instance_specs',
                                default: 'medium',
                              },
                              CloudConnectorVersion: {
                                type: 'string',
                                cannotBeUpdated: false,
                                title: 'Cloud Connector Version',
                                description: '',
                                default: '6.1.24',
                                pattern: '^\\S+$',
                              },
                            },
                            required: [
                              'CloudConnectorProvisioningUrl',
                              'InstanceSpecification',
                              'CloudConnectorVersion',
                            ],
                          },
                        ],
                      },
                    },
                  },
                },
                required: ['regionName', 'NetworkProperties'],
              },
              minItems: 1,
              uniqueItems: true,
            },
          },
          required: ['customDevOps', 'general', 'regionalParameters'],
        },
        minItems: 1,
        maxItems: 1,
        uniqueItems: true,
      },
      minProperties: 1,
    },
  };

  constructor(
    private formlyJsonschema: FormlyJsonschema,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.form = new FormGroup({});
    this.options = {};
    this.fields = [this.formlyJsonschema.toFieldConfig(this.schema)];
    this.model = {};
  }

  submit() {
    alert(JSON.stringify(this.model));
  }
}

/**  Copyright 2021 Formly. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://github.com/ngx-formly/ngx-formly/blob/main/LICENSE */